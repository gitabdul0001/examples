import { UserMenu } from '@modelence/auth-ui';

// @ts-ignore
import logo from '../assets/modelence.png';

export default function Header() {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Modelence Logo" className="w-8 h-8" />
        <span className="text-lg font-semibold text-gray-800">Agent Chat</span>
      </div>
      <UserMenu />
    </div>
  );
} 