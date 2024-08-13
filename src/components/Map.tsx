/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Polygon,
  Circle,
  Rectangle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import * as L from "leaflet";
import "leaflet-draw";
import parse_georaster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import { useObjects } from "../contexts/ObjectsContext";
import { MAP_DEFAULT, MAP_TILE_COPYRIGHT } from "../constants/map.constant";
import { fetchImageDate } from "../apis/object.api";

declare global {
  interface Window {
    type: boolean;
  }
}

window.type = true;

interface IMapSatelLiteProps {
  setLoadingSatellite: (type: boolean) => void;
}
const MapSatelLite = ({ setLoadingSatellite }: IMapSatelLiteProps) => {
  const map = useMap();

  useEffect(() => {
    setLoadingSatellite(true);
    fetchImageDate().then((arrayBuffer) => {
      parse_georaster(arrayBuffer).then((georaster: any) => {
        const layer = new GeoRasterLayer({
          georaster: georaster,
          // opacity: 0.7,
          resolution: 64, // optional parameter for adjusting display resolution
        });
        map.addLayer(layer);
        map.fitBounds(layer.getBounds());
        setLoadingSatellite(false);
      });
    });
  }, []);
  return null;
};

interface IMyMapProps {
  onCreateObject: (e: L.LeafletEvent) => void;
  onUpdateObject: (layer: any, objectEdit: any) => void;
  selectedObjectId: string | null;
}
const MyMap = ({
  onCreateObject,
  onUpdateObject,
  selectedObjectId,
}: IMyMapProps) => {
  const map = useMap();
  const { objects } = useObjects();
  const editableLayersRef = useRef(new L.FeatureGroup());
  useEffect(() => {
    // map.invalidateSize();
    // editableLayersRef.current = ;
    map.addLayer(editableLayersRef.current);

    const drawControl = new L.Control.Draw({
      draw: {
        rectangle: {
          shapeOptions: {},
        },
        polygon: {},
        polyline: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event) => {
      onCreateObject(event);
    });

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED);
    };
  }, [onCreateObject, objects, selectedObjectId]);

  const handleShowSaveButton = (layer: any, objectEdit: any) => {
    const saveButton: any = document
      .getElementById(`${objectEdit.id}`)
      ?.getElementsByClassName("btn-save")[0];
    if (saveButton)
      saveButton.onclick = async () => {
        editableLayersRef.current.clearLayers();

        await onUpdateObject(layer, objectEdit);
        // Disable editing after saving
        // layer.editing.disable();
      };
  };

  useEffect(() => {
    if (selectedObjectId !== null) {
      // Enable editing for only the selected object

      const objectEdit = objects.find((i) => i.id === selectedObjectId);
      let layer;
      if (objectEdit?.type === "circle") {
        layer = L.circle(objectEdit?.coordinates, {
          radius: objectEdit?.radius,
        });
      } else if (objectEdit?.type === "polygon") {
        layer = L.polygon(objectEdit?.coordinates);
      } else if (objectEdit?.type === "rectangle") {
        layer = L.rectangle(objectEdit?.coordinates);
      }

      if (!layer) return;

      editableLayersRef.current.addLayer(layer);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editableLayersRef.current.eachLayer((layer: any) => {
        layer.editing.enable();
        handleShowSaveButton(layer, objectEdit);
      });
    }
  }, [selectedObjectId]);

  return null;
};

interface IMapComponentProps {
  selectedObjectId: string | null;
  onCreateObject: (e: L.LeafletEvent) => void;
  onUpdateObject: (layer: any, objectEdit: any) => void;
  setLoadingSatellite: (e: boolean) => void;
}
const MapComponent = ({
  selectedObjectId,
  onCreateObject,
  onUpdateObject,
  setLoadingSatellite,
}: IMapComponentProps) => {
  const { objects } = useObjects();

  return (
    <MapContainer {...MAP_DEFAULT} className="map-container">
      <TileLayer
        attribution={MAP_TILE_COPYRIGHT}
        url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedObjectId === null &&
        objects.map((obj) =>
          obj.type === "circle" ? (
            <Circle key={obj.id} center={obj.coordinates} radius={obj.radius} />
          ) : obj.type === "rectangle" ? (
            <Rectangle key={obj.id} bounds={obj.coordinates} />
          ) : (
            <Polygon key={obj.id} positions={obj.coordinates} />
          )
        )}
      <MyMap
        onCreateObject={onCreateObject}
        onUpdateObject={onUpdateObject}
        selectedObjectId={selectedObjectId}
      />
      <MapSatelLite setLoadingSatellite={setLoadingSatellite} />
    </MapContainer>
  );
};

export default MapComponent;
