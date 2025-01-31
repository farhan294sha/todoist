import { Skeleton } from "./ui/skeleton";

const AddtodoOverlaySkeleton = () => {
  return (
    <div className="flex justify-between">
      <div className="space-y-5 relative pl-6 pr-4 pt-1 w-[65%]">
        {/* Title Skeleton */}
        <div className="flex items-center">
          <div className="absolute -left-4">
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
          <Skeleton className="w-48 h-6" />
        </div>

        {/* Description Skeleton */}
        <div className="flex items-center mt-3">
          <Skeleton className="w-4 h-5 mr-2" />
          <Skeleton className="w-64 h-4" />
        </div>

        {/* Sub-tasks Skeleton */}
        <div className="space-y-2">
          <div className="flex items-center justify-between group h-10">
            <div className="flex items-center">
              <Skeleton className="w-4 h-4 mr-2" />
              <Skeleton className="w-40 h-4" />
            </div>
            <Skeleton className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between group h-10">
            <div className="flex items-center">
              <Skeleton className="w-4 h-4 mr-2" />
              <Skeleton className="w-40 h-4" />
            </div>
            <Skeleton className="w-6 h-6" />
          </div>
        </div>

        {/* Comment Skeleton */}
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
      <div className="bg-gray-50 p-4 w-52">
        <div className="grid grid-cols-1 gap-4">
          {/* Project Selector Skeleton */}
          <div>
            <Skeleton className="w-20 h-4 mb-2" /> {/* Project Label */}
            <div className="flex items-center space-x-2">
              <Skeleton className="w-full h-8" /> {/* Project Selector */}
            </div>
          </div>


          {/* Due Date Skeleton */}
          <div>
            <Skeleton className="w-20 h-4 mb-2" /> {/* Due Date Label */}
            <div className="flex items-center space-x-2">
              <Skeleton className="w-full h-8" /> {/* Due Date Button */}
            </div>
          </div>

          {/* Priority Skeleton */}
          <div>
            <Skeleton className="w-20 h-4 mb-2" /> {/* Priority Label */}
            <div className="flex items-center space-x-2">
              <Skeleton className="w-full h-8" /> {/* Priority Button */}
            </div>
          </div>

          {/* Reminder Skeleton */}
          <div>
            <Skeleton className="w-20 h-4 mb-2" /> {/* Reminders Label */}
            <div className="flex items-center space-x-2">
              <Skeleton className="w-full h-8" /> {/* Reminder Button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddtodoOverlaySkeleton;
