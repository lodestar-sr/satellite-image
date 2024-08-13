import "./App.css";
import { useEffect, useState } from "react";

import MapComponent from "./components/Map";
import ObjectsSidebar from "./components/Sidebar";
import { ObjectsProvider, useObjects } from "./contexts/ObjectsContext";
import {
  createObject,
  deleteObject,
  fetchObjects,
  updateObject,
} from "./apis/object.api";
import { DrawEvents, Polygon } from "leaflet";

function App() {
  const { dispatch } = useObjects();
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [loadingSatellite, setLoadingSatellite] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // const url = await fetchImageUrl();
      // setImageUrl(url);

      const objs = await fetchObjects();
      dispatch({ type: "SET_OBJECTS", payload: objs });
    };

    loadData();
  }, [dispatch]);

  const handleSelectObject = (id: string | null) => {
    setSelectedObjectId(id);
  };

  const handleCreated = async (e: L.LeafletEvent) => {
    const layer = e.layer as Polygon;
    const shapeType = (e as DrawEvents.Created).layerType;
    const result = await createObject(layer.toGeoJSON());
    console.log("handleCreated", e);

    const newObject = {
      id: result.id as string,
      type: shapeType,
      coordinates: layer.getLatLngs(),
    };
    dispatch({ type: "ADD_OBJECT", payload: newObject });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdated = async (layer: any, objectEdit: any) => {
    await updateObject(objectEdit.id, layer.toGeoJSON());

    const editedObject = {
      id: objectEdit.id,
      type: objectEdit.type,
      coordinates:
        objectEdit.type === "circle" ? layer.getLatLng() : layer.getLatLngs(),
      radius: objectEdit.type === "circle" ? layer.getRadius() : undefined,
    };

    dispatch({ type: "UPDATE_OBJECT", payload: editedObject });
  };

  const handleDeleted = async (id: string) => {
    await deleteObject(id);

    dispatch({ type: "REMOVE_OBJECT", payload: { id } });
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flexGrow: 1 }}>
        <MapComponent
          selectedObjectId={selectedObjectId}
          onCreateObject={handleCreated}
          onUpdateObject={handleUpdated}
          setLoadingSatellite={setLoadingSatellite}
        />
      </div>
      <ObjectsSidebar
        selectedObjectId={selectedObjectId}
        onSelectObject={handleSelectObject}
        onDeleteObject={handleDeleted}
        loadingSatellite={loadingSatellite}
      />
    </div>
  );
}

const AppWrapper = () => {
  return (
    <ObjectsProvider>
      <App />
    </ObjectsProvider>
  );
};

export default AppWrapper;
