import useFormStore from "@/stores/FormStore";
import { fleets } from "./CarList";
import Image from "next/image";
import { LuggageIcon, Users } from "lucide-react";
 
export default function SelectedCar() 
{
  const { formData } = useFormStore();
  
  const selectedFleet = fleets.find((item) => item.category === formData.car.value);
  
  if(!selectedFleet) return null;

  const firstVehicle = selectedFleet.vehicles[0];
  const vehicleNames = selectedFleet.vehicles.map(v => v.name).join(", ");
 
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between gap-4 w-full">
      <div className="w-16 h-12 relative">
        <Image 
          src={firstVehicle.imageUrl} 
          alt={selectedFleet.displayName} 
          fill
          className="object-contain"
        />
      </div>
      
      <div className="flex-1">
        <div className="font-bold text-sm">{selectedFleet.displayName}</div>
        <div className="text-xs text-gray-600">{vehicleNames} or similar</div>
      </div>
      
      <div className="flex items-center gap-4">
         
         <div className="flex items-center gap-1">
            <Users className="size-4 text-gray-600"/>
            <p className="text-sm">{selectedFleet.passengers}</p>
         </div>
         
         <div className="flex items-center gap-1">
            <LuggageIcon className="size-4 text-gray-600"/>
            <p className="text-sm">{selectedFleet.luggage}</p>
         </div>

      </div>
    </div>
  );
}