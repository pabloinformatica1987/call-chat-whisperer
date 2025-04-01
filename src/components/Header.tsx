
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  PhoneCall,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

const Header: React.FC = () => {
  const { state, dispatch } = useApp();
  const { setTheme, theme } = useTheme();

  return (
    <header className="w-full px-4 py-4 bg-gradient-to-r from-whisperer-primary to-whisperer-secondary text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <PhoneCall className="w-6 h-6" />
          <h1 className="text-xl font-bold">Call Whisperer</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-mode"
              checked={state.isEnabled}
              onCheckedChange={(checked) => {
                dispatch({ type: 'SET_ENABLED', payload: checked });
                if (checked) {
                  checkPermissions();
                }
              }}
            />
            <Label htmlFor="enable-mode" className="text-white">
              {state.isEnabled ? 'Active' : 'Disabled'}
            </Label>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-white" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

async function checkPermissions() {
  try {
    // In a real mobile app, this would check for call handling permissions
    console.log('Checking permissions...');
  } catch (error) {
    console.error('Error checking permissions:', error);
  }
}

export default Header;
