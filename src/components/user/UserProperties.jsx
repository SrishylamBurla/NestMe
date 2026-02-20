import PropertiesGrid from "@/components/PropertiesGrid";

export default function UserProperties({ properties }) {
  if (!properties.length) {
    return (
      <div className="text-center text-gray-500">
        No properties listed yet.
      </div>
    );
  }

  return <PropertiesGrid properties={properties} />;
}
