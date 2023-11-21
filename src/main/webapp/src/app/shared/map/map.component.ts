import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import { GeocodeResponse, MapService } from './map.service';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@Component({
    standalone: true,
    selector: 'sgh-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    imports: [
        FormsModule,
        LeafletModule
    ]
})
export class MapComponent implements OnInit, OnChanges {

    @Output() locationEventEmitter: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();
    @Input() lat?: number;
    @Input() lng?: number;
    marker: L.Marker = new L.Marker([45.9442858, 25.0094303]);
    address: string = '';
    map: L.Map | undefined;
    options: L.MapOptions = {
        layers: [
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
            })
        ],
        zoom: 10,
        center: L.latLng(this.marker.getLatLng().lat, this.marker.getLatLng().lng)
    };

    constructor(private mapService: MapService) {
    }

    ngOnInit(): void {
        if (this.lat && this.lng) {
            this.marker = new L.Marker([this.lat, this.lng]);
        }
    }

    ngOnChanges(): void {
        if (this.lat && this.lng) {
            this.marker.setLatLng([this.lat, this.lng]);
            this.resetMarkerOnMap();
            this.getLocationAddress();
        }
    }

    // sync with leaflet 'map' after it has been loaded and add marker to map
    onMapReady(map: L.Map): void {
        this.map = map;
        this.marker = new L.Marker(this.marker.getLatLng(), {
            icon: L.icon({
                iconUrl: 'main/webapp/src/assets/blue-marker.svg',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            })
        }).addTo(map);
    }

    // recenter map to marker (setView to marker's position)
    resetMarkerOnMap(): void {
        this.map?.setView(this.marker.getLatLng());
    }

    // move marker to new position on click and recenter map
    moveMarkerToNewPosition(event: L.LeafletMouseEvent): void {
        this.marker.setLatLng(L.latLng(event.latlng.lat, event.latlng.lng));
        this.locationEventEmitter.emit([event.latlng.lat, event.latlng.lng]);
        this.getLocationAddress();
        this.resetMarkerOnMap();
    }

    getLocationCoordinates(): void {
        this.mapService.getLocationCoordinates(this.address)
            .then((result: GeocodeResponse): void => {
                this.marker.setLatLng(new L.LatLng(result.results[0].geometry.lat, result.results[0].geometry.lng));
                this.resetMarkerOnMap();
            })
            .catch((error): void => {
                console.error(error);
            });
    }

    getLocationAddress(): void {
        this.mapService.getLocationAddress(this.marker.getLatLng().lat, this.marker.getLatLng().lng)
            .then((result: GeocodeResponse): void => {
                this.address = result.results[0].formatted;
            })
            .catch((error): void => {
                console.error(error);
            });
    }
}
