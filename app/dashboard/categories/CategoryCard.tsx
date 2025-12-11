import { Button } from "@/components/ui/button";

const CategoryCard = ({
  category,
  handleDeleteClick,
  handleEditClick,
}: {
  category: ICategory;
  handleDeleteClick: (category: ICategory) => void;
  handleEditClick: (category: ICategory) => void;
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-all duration-200 bg-white">
      <h3 className="font-medium text-gray-800">{category.name}</h3>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditClick(category)}
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
        >
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDeleteClick(category)}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CategoryCard;
