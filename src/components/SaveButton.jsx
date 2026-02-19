import { useToggleSavePropertyMutation } from "@/store/services/savedApi";

function SaveButton({ propertyId }) {
  const [toggleSave] = useToggleSavePropertyMutation();

  return (
    <button onClick={() => toggleSave(propertyId)}>
      <span
        className="material-symbols-outlined fill-current"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        favorite
      </span>
    </button>
  );
}
