import { useObjects } from "../contexts/ObjectsContext";

interface ISidebarProps {
  selectedObjectId?: string | null;
  onSelectObject: (id: string | null) => void;
  onDeleteObject: (id: string) => void;
  loadingSatellite: boolean;
}

const ObjectsSidebar = ({
  selectedObjectId,
  onSelectObject,
  onDeleteObject,
  loadingSatellite,
}: ISidebarProps) => {
  const { objects } = useObjects();

  return (
    <div className="sidebar-container">
      <h2>
        Satellite image:{" "}
        {loadingSatellite === true ? (
          <span className="status-satellite loading">loading ...</span>
        ) : (
          <span className="status-satellite done">done</span>
        )}{" "}
      </h2>
      <h2>Object List</h2>
      <ul>
        {objects.map((obj, idx) => (
          <li
            id={obj.id}
            key={`object-${idx}`}
            className={`${obj.id === selectedObjectId ? "editing" : ""}`}
          >
            <div className="header">
              {obj.type} (ID: {obj.id})
            </div>
            <div>
              {selectedObjectId === obj.id ? (
                <button
                  className="btn btn-warning btn-save"
                  onClick={() => {
                    onSelectObject(null);
                    // onSaveObject(id);
                  }}
                >
                  Save
                </button>
              ) : (
                <button
                  className="btn btn-success btn-edit"
                  onClick={() => onSelectObject(obj.id)}
                >
                  Edit
                </button>
              )}
              <button
                className="btn btn-danger btn-remove float-right"
                onClick={async (e) => {
                  e.stopPropagation();

                  await onDeleteObject(obj.id);
                }}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ObjectsSidebar;
