import { Injectable } from '@angular/core';
import { AppService } from '../../app.service';
import { environment } from '../../environment';
import * as opencage from 'opencage-api-client';

// opencage geocode api
// q: request param / query param (coordinates or address)
// key: api key from opencage
// language: address format

// response format part
export type GeocodeResponse = {
    results: {
        components: {
            _category?: string;
            _type?: string;
            continent?: string;
            country?: string;
            country_code?: string;
            county?: string;
            political_union?: string;
            postcode?: string;
            road?: string;
            road_reference?: string;
            road_type?: string;
            village?: string;
            city?: string;
            town?: string;
        },
        formatted: string,
        geometry: {
            lat: number;
            lng: number;
        },
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class MapService extends AppService {

    // request address by coordinates
    async getLocationAddress(lat: number, lng: number): Promise<GeocodeResponse> {
        return await opencage.geocode({
            q: `${lat}, ${lng}`,
            key: environment.geocodingApiKey,
            language: 'en'
        });
    }

    // request coordinates by address
    async getLocationCoordinates(address: string): Promise<GeocodeResponse> {
        return await opencage.geocode({
            q: address,
            key: environment.geocodingApiKey,
            language: 'en'
        });
    }
}
