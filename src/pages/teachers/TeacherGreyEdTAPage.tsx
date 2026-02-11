import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, MessageCircle } from 'lucide-react';
import TeacherPageLayout from '../../components/teachers/TeacherPageLayout';

const TeacherGreyEdTAPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.title = 'GreyEd TA | GreyEd Teachers';

    if (!authLoading && !user) {
      navigate('/');
    }

    try {
      const savedCollapsed = localStorage.getItem('sidebarCollapsed');
      if (savedCollapsed === 'true') {
        setSidebarCollapsed(true);
      }
    } catch {
      // localStorage unavailable
    }

    // Inject the HeyGen AI Avatar script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `!function(window){const host="https://labs.heygen.com",url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJKdWR5X1RlYWNoZXJfU3RhbmRpbmdfcHVi%0D%0AbGljIiwicHJldmlld0ltZyI6Imh0dHBzOi8vZmlsZXMyLmhleWdlbi5haS9hdmF0YXIvdjMvNmNk%0D%0ANzAzMWFhOTdlNDk2ODk3MzkxZGQ0NGRhZTU2YmVfNDU2MzAvcHJldmlld190YWxrXzEud2VicCIs%0D%0AIm5lZWRSZW1vdmVCYWNrZ3JvdW5kIjpmYWxzZSwia25vd2xlZGdlQmFzZUlkIjoiZGE2MjQ3ZmQ5%0D%0AOTQ0NGMwNjlhY2QwMzA5OWJlOWRiMjkiLCJ1c2VybmFtZSI6ImMyYzZiMzg5YmZhNzRlNzNhMDc5%0D%0AOWRjNTFiMzNiMGMzIn0%3D&inIFrame=1",clientWidth=document.body.clientWidth,wrapDiv=document.createElement("div");wrapDiv.id="heygen-streaming-embed";const container=document.createElement("div");container.id="heygen-streaming-container";const stylesheet=document.createElement("style");stylesheet.innerHTML=\`\\n  #heygen-streaming-embed {\\n    z-index: 9999;\\n    position: fixed;\\n    right: 24px;\\n    bottom: 24px;\\n    width: 140px;\\n    height: 140px;\\n    border-radius: 50%;\\n    border: 3px solid #1B4332;\\n    box-shadow: 0px 8px 24px 0px rgba(27, 67, 50, 0.25);\\n    transition: all 0.3s ease;\\n    overflow: hidden;\\n    cursor: pointer;\\n\\n    opacity: 1;\\n    visibility: visible;\\n  }\\n  #heygen-streaming-embed:hover {\\n    transform: scale(1.05);\\n    box-shadow: 0px 12px 32px 0px rgba(27, 67, 50, 0.35);\\n  }\\n  #heygen-streaming-embed.show {\\n    opacity: 1;\\n    visibility: visible;\\n  }\\n  #heygen-streaming-embed.expand {\\n    \${clientWidth<540?"height: 70vh; width: 96%; right: 2%; bottom: 12px; transform: none;":"height: 500px; width: calc(500px * 16 / 9); right: 24px; bottom: 24px;"}\\n    border: 0;\\n    border-radius: 12px;\\n  }\\n  #heygen-streaming-embed.expand:hover {\\n    transform: none;\\n  }\\n  #heygen-streaming-container {\\n    width: 100%;\\n    height: 100%;\\n  }\\n  #heygen-streaming-container iframe {\\n    width: 100%;\\n    height: 100%;\\n    border: 0;\\n  }\\n  \`;const iframe=document.createElement("iframe");iframe.allowFullscreen=!1,iframe.title="Streaming Embed",iframe.role="dialog",iframe.allow="microphone",iframe.src=url;let visible=!1,initial=!0;window.addEventListener("message",(e=>{e.origin===host&&e.data&&e.data.type&&"streaming-embed"===e.data.type&&("init"===e.data.action?(initial=!0,wrapDiv.classList.toggle("show",initial)):"show"===e.data.action?(visible=!0,wrapDiv.classList.toggle("expand",visible)):"hide"===e.data.action&&(visible=!1,wrapDiv.classList.toggle("expand",visible)))}));wrapDiv.classList.add("show");container.appendChild(iframe),wrapDiv.appendChild(stylesheet),wrapDiv.appendChild(container),document.body.appendChild(wrapDiv)}(globalThis);`;

    document.body.appendChild(script);

    return () => {
      const embedDiv = document.getElementById('heygen-streaming-embed');
      if (embedDiv) {
        embedDiv.remove();
      }
    };
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    try {
      localStorage.setItem('sidebarCollapsed', String(newState));
    } catch {
      /* private browsing */
    }
  };

  return (
    <TeacherPageLayout
      activePage="grey-ed-ta"
      onLogout={handleLogout}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={toggleSidebar}
      loading={authLoading}
      loadingMessage="Loading..."
    >
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-headline font-semibold text-primary mb-4">
              Welcome to GreyEd TA
            </h2>
            <p className="text-text-muted">
              Click the avatar in the bottom-right corner to start chatting with Judy,
              your interactive teaching assistant for lesson planning, assessments, and more.
            </p>
          </div>

          <div className="mb-8 p-5 bg-accent/10 rounded-lg">
            <h3 className="font-medium text-text mb-3">How to use GreyEd TA</h3>
            <ul className="space-y-2 text-text/80">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/70 flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">1</div>
                <span><strong>Click the circular avatar in the bottom-right corner</strong> to start chatting with Judy</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-primary mr-2 flex-shrink-0 mt-0.5">2</div>
                <span>Get help generating ideas for classroom activities and student engagement</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-primary mr-2 flex-shrink-0 mt-0.5">3</div>
                <span>Receive personalized recommendations based on your teaching style and goals</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-text-muted mb-4 font-medium">
              The circular avatar should be visible in the bottom-right corner of your screen.
              Click it to start interacting with Judy.
            </p>

            <div className="flex justify-center">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center mx-auto">
                <BookOpen size={18} className="mr-2" />
                View Teaching Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    </TeacherPageLayout>
  );
};

export default TeacherGreyEdTAPage;
