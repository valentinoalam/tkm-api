export interface Transaction {
    id: string;
    dtTransaction: Date;
    activity: string;
    category: {
      id: string;
      category: string;
      color: string;
      type: string;
    };
    value: number;
    photo?: {
      name: string;
      downloadLink: string;
    } | null;
  }