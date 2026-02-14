import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ReportJob } from '../models';

/**
 * Service responsible for managing the real-time WebSocket connection using SignalR.
 * It listens for updates from the backend and broadcasts them to the rest of the application
 * using an Angular Signal.
 */
@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection: signalR.HubConnection | undefined;

    // A reactive Signal that holds the latest job update received from the server.
    // Components can subscribe to this signal to react to changes instantly.
    public jobUpdate = signal<ReportJob | null>(null);

    constructor() { }

    /**
     * Establishes the SignalR connection to the backend hub.
     * Configures the connection to handle 'ReceiveUpdate' events.
     */
    public startConnection = () => {
        try {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('https://localhost:7232/reportHub', {
                    // 'withCredentials' is set to false to avoid CORS issues when the backend allows any origin (*).
                    withCredentials: false
                })
                .build();

            this.hubConnection
                .start()
                .then(() => console.log('SignalR Connection started'))
                .catch(err => console.error('Error while starting connection: ' + err));

            // Listen for the 'ReceiveUpdate' event triggered by the backend BackgroundService
            this.hubConnection.on('ReceiveUpdate', (job: ReportJob) => {
                try {
                    console.log('SignalR: Job update received:', job);
                    // Update the signal, which notifies any listening components (like ReportListComponent)
                    this.jobUpdate.set(job);
                } catch (error) {
                    console.error('Error handling ReceiveUpdate', error);
                }
            });

            this.hubConnection.onclose((error) => {
                console.warn('SignalR Connection closed', error);
            });
        } catch (error) {
            console.error('Error initializing SignalR connection', error);
        }
    }
}
