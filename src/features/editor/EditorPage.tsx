import { Helmet } from 'react-helmet-async';
import TopMenuBar from './components/TopMenuBar';
import Toolbar from './components/Toolbar';
import CanvasArea from './components/CanvasArea';
import RightSidebar from './components/RightSidebar';
import StatusBar from './components/StatusBar';

export default function EditorPage() {
  return (
    <>
      <Helmet><title>Image Editor – ImageCraft</title></Helmet>
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <TopMenuBar />
        <div className="flex flex-1 overflow-hidden">
          <Toolbar />
          <div className="relative flex-1"><CanvasArea /></div>
          <RightSidebar />
        </div>
        <StatusBar />
      </div>
    </>
  );
}