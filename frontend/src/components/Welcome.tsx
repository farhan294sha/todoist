const Welcome = () => {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h1 className="text-xl font-semibold pb-4">
        Welcome to <span className="text-[#17CF97]">FocusFlow</span>
      </h1>
      <img src="./todoimage.jpg" alt="todoimage" />
      <p>
        Stay Organized, Stay Ahead with{" "}
        <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-[#17CF97] relative inline-block">
          <span className="relative text-white">FocusFlow</span>
        </span>
      </p>
    </div>
  );
};
export default Welcome;
