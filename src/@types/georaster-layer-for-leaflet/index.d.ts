declare module 'georaster-layer-for-leaflet' {
    import * as L from 'leaflet';

    export interface GeoRasterLayerOptions extends L.GridLayerOptions {
        georaster: any;
        pixelValuesToColorFn(data: number[]): string;
        resolution?: number;
    }

    export default class GeoRasterLayer extends L.GridLayer {
        constructor(options?: GeoRasterLayerOptions);
        getBounds(): L.LatLngBounds;
    }
}