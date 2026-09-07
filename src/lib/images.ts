const foodImages = {
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85',
  chicken: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85',
  pasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85',
  dessert: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85',
  steak: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
};

const menuImageRules: Array<[string, keyof typeof foodImages]> = [
  ['polo stuffed chicken', 'chicken'],
  ['chicken', 'chicken'],
  ['steak', 'steak'],
  ['fries', 'fries'],
  ['sandwich', 'chicken'],
  ['burger', 'chicken'],
  ['pasta', 'pasta'],
  ['shake', 'dessert'],
  ['brownie', 'dessert'],
  ['pastry', 'dessert'],
  ['cookie', 'dessert'],
  ['coffee', 'coffee'],
  ['tea', 'coffee'],
  ['salad', 'salad'],
];

export function getMenuImage(name: string) {
  const match = menuImageRules.find(([keyword]) => name.toLowerCase().includes(keyword));
  return foodImages[match?.[1] || 'chicken'];
}

export default foodImages;