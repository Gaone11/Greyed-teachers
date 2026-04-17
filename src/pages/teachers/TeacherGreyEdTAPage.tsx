import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import { AlertCircle, Loader, X, Menu, BookOpen, MessageCircle } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const TeacherGreyEdTAPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('teacherSidebarCollapsed') === 'true');
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    document.title = "GreyEd TA | GreyEd Teachers";
    
    // Redirect if not logged in
    if (!authLoading && !user) {
      navigate('/auth/login');
    }
    
    // Inject the HeyGen AI Avatar script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `!function(window){const host="https://labs.heygen.com",url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJKdWR5X1RlYWNoZXJfU3RhbmRpbmdfcHVi%0D%0AbGljIiwicHJldmlld0ltZyI6Imh0dHBzOi8vZmlsZXMyLmhleWdlbi5haS9hdmF0YXIvdjMvNmNk%0D%0ANzAzMWFhOTdlNDk2ODk3MzkxZGQ0NGRhZTU2YmVfNDU2MzAvcHJldmlld190YWxrXzEud2VicCIs%0D%0AIm5lZWRSZW1vdmVCYWNrZ3JvdW5kIjpmYWxzZSwia25vd2xlZGdlQmFzZUlkIjoiZGE2MjQ3ZmQ5%0D%0AOTQ0NGMwNjlhY2QwMzA5OWJlOWRiMjkiLCJ1c2VybmFtZSI6ImMyYzZiMzg5YmZhNzRlNzNhMDc5%0D%0AOWRjNTFiMzNiMGMzIn0%3D&inIFrame=1",clientWidth=document.body.clientWidth,wrapDiv=document.createElement("div");wrapDiv.id="heygen-streaming-embed";const container=document.createElement("div");container.id="heygen-streaming-container";const stylesheet=document.createElement("style");stylesheet.innerHTML=\`\\n  #heygen-streaming-embed {\\n    z-index: 9999;\\n    position: fixed;\\n    right: 24px;\\n    bottom: 24px;\\n    width: 140px;\\n    height: 140px;\\n    border-radius: 50%;\\n    border: 3px solid #0F172A;\\n    box-shadow: 0px 8px 24px 0px rgba(27, 67, 50, 0.25);\\n    transition: all 0.3s ease;\\n    overflow: hidden;\\n    cursor: pointer;\\n\\n    opacity: 1;\\n    visibility: visible;\\n  }\\n  #heygen-streaming-embed:hover {\\n    transform: scale(1.05);\\n    box-shadow: 0px 12px 32px 0px rgba(27, 67, 50, 0.35);\\n  }\\n  #heygen-streaming-embed.show {\\n    opacity: 1;\\n    visibility: visible;\\n  }\\n  #heygen-streaming-embed.expand {\\n    \${clientWidth<540?"height: 70vh; width: 96%; right: 2%; bottom: 12px; transform: none;":"height: 500px; width: calc(500px * 16 / 9); right: 24px; bottom: 24px;"}\\n    border: 0;\\n    border-radius: 12px;\\n  }\\n  #heygen-streaming-embed.expand:hover {\\n    transform: none;\\n  }\\n  #heygen-streaming-container {\\n    width: 100%;\\n    height: 100%;\\n  }\\n  #heygen-streaming-container iframe {\\n    width: 100%;\\n    height: 100%;\\n    border: 0;\\n  }\\n  \`;const iframe=document.createElement("iframe");iframe.allowFullscreen=!1,iframe.title="Streaming Embed",iframe.role="dialog",iframe.allow="microphone",iframe.src=url;let visible=!1,initial=!0;window.addEventListener("message",(e=>{e.origin===host&&e.data&&e.data.type&&"streaming-embed"===e.data.type&&("init"===e.data.action?(initial=!0,wrapDiv.classList.toggle("show",initial)):"show"===e.data.action?(visible=!0,wrapDiv.classList.toggle("expand",visible)):"hide"===e.data.action&&(visible=!1,wrapDiv.classList.toggle("expand",visible)))}));wrapDiv.classList.add("show");container.appendChild(iframe),wrapDiv.appendChild(stylesheet),wrapDiv.appendChild(container),document.body.appendChild(wrapDiv)}(globalThis);`;
    
    document.body.appendChild(script);
    
    return () => {
      // Cleanup script on unmount
      const embedDiv = document.getElementById('heygen-streaming-embed');
      if (embedDiv) {
        embedDiv.remove();
      }
    };
  }, [user, authLoading, navigate]);
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('teacherSidebarCollapsed', String(newState));
  };
  
  if (authLoading) {
    return (
      <>
        <NavBar sidebarCollapsed={sidebarCollapsed} />
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-greyed-navy">
          <div className="text-center">
            <Loader className="w-12 h-12 text-greyed-blue mx-auto animate-spin" />
            <p className="mt-4 text-black font-semibold">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar sidebarCollapsed={sidebarCollapsed} />
      
      <div className="min-h-screen pt-[72px] bg-slate-50 flex">
        {/* Mobile menu overlay */}
        {showMobileMenu && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)}></div>
        )}
        
        {/* Left sidebar navigation */}
        <div className={`bg-white border-r border-white/5 shadow-sm ${
          isMobile
            ? `fixed inset-y-0 pt-16 z-50 transition-transform transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0 bottom-0 z-40'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <TeacherSidebar
            activePage="grey-ed-ta"
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            isMobile={isMobile}
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
          />

          {/* Close button for mobile menu */}
          {showMobileMenu && isMobile && (
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4 p-2 text-white bg-greyed-navy/50 rounded-full"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 pt-0 pb-16 md:pb-0 transition-all duration-300"
          style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}>
          <main className="px-4 sm:px-6 lg:px-8">
            {/* Mobile menu toggle */}
            <div className="md:hidden mb-2">
              <button 
                className="p-2 rounded-lg hover:bg-greyed-navy/10"
                onClick={toggleMobileMenu}
              >
                <Menu size={20} />
              </button>
            </div>
            
            {/* Main content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-greyed-navy" />
                  </div>
                  <h2 className="text-xl font-headline font-semibold text-greyed-navy mb-4">
                    Welcome to GreyEd TA
                  </h2>
                  <p className="text-greyed-navy/70">
                    Click the avatar in the bottom-right corner to start chatting with Judy,
                    your interactive teaching assistant for lesson planning, assessments, and more.
                  </p>
                </div>
                
                <div className="mb-8 p-5 bg-greyed-beige/20 rounded-lg">
                  <h3 className="font-medium text-black mb-3">How to use GreyEd TA</h3>
                  <ul className="space-y-2 text-black/80">
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-greyed-blue/70 flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">1</div>
                      <span><strong>Click the circular avatar in the bottom-right corner</strong> to start chatting with Judy</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-greyed-blue/30 flex items-center justify-center text-greyed-navy mr-2 flex-shrink-0 mt-0.5">2</div>
                      <span>Get help generating ideas for classroom activities and student engagement</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-greyed-blue/30 flex items-center justify-center text-greyed-navy mr-2 flex-shrink-0 mt-0.5">3</div>
                      <span>Receive personalized recommendations based on your teaching style and goals</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <p className="text-greyed-navy/90 mb-4 font-medium">
                    The circular avatar should be visible in the bottom-right corner of your screen.
                    Click it to start interacting with Judy.
                  </p>
                  
                  <div className="flex justify-center">
                    <button className="px-4 py-2 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors flex items-center mx-auto">
                      <BookOpen size={18} className="mr-2" />
                      View Teaching Resources
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
    </>
  );
};

export default TeacherGreyEdTAPage;