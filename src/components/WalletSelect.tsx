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

const abbreviateAddress = (address: string) => `${address.slice(0, 8)}…${address.slice(-8)}`;

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
              {abbreviateAddress(wallet.address)} ({wallet.balance} 币)
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-wallet" disabled>
            请先创建第一个钱包
          </SelectItem>
        )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WalletSelect;
