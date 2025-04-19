import GoogleAd from '../components/GoogleAd';

const GameLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          {/* Left Ad - Desktop only */}
          <div className="hidden lg:block w-[300px] min-h-[600px]">
            <div className="sticky top-4">
              <GoogleAd
                slot="1234567890"
                style={{ display: 'block', minHeight: '600px' }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
            
            {/* Mobile Ad - Below content */}
            <div className="lg:hidden mt-8">
              <GoogleAd
                slot="0987654321"
                style={{ display: 'block', minHeight: '250px' }}
              />
            </div>
          </div>

          {/* Right Ad - Desktop only */}
          <div className="hidden lg:block w-[300px] min-h-[600px]">
            <div className="sticky top-4">
              <GoogleAd
                slot="5432109876"
                style={{ display: 'block', minHeight: '600px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLayout; 