// src/components/WalletSelect.tsx

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useBlockchainStore from '@/store/useBlockchainStore';

interface WalletSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  label: string;
}

const WalletSelect: React.FC<WalletSelectProps> = ({ value, onValueChange, placeholder, label }) => {
  const { wallets } = useBlockchainStore();

  return (
    <div className="space-y-2">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700">{label}</label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger id={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <SelectItem key={wallet.address} value={wallet.address}>
                {wallet.address} ({wallet.balance} 币)
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-wallet" disabled>
              没有可用的钱包
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WalletSelect;