import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full bg-white py-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-xl font-bold hover:underline">
          Pinpoint
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="text-lg font-semibold hover:underline">
            Daily
          </Link>
          <Link
            href="/practice"
            className="text-lg font-semibold flex items-center hover:underline"
          >
            Practice{" "}
            <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm">
              EXP
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
