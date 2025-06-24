import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { Menu } from "lucide-react";
export interface category{
    id:string;
    label:string; 
}
export default function AppMenu({categories,setCategory}: {categories: category[],setCategory: (category: string) => void}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered"><Menu size={20} /></Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
                {categories.map((category) => (
                <DropdownItem key={category.id}>
                    <div
                        onClick={() => setCategory(category.id)}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        {category.label}
                    </div>
                </DropdownItem>))
                }
      </DropdownMenu>
    </Dropdown>
  );
}
