export type Database = {
  public: {
    Tables: {
      currencies: {
        Row: {
          id: string;
          code: string;
          name: string;
          symbol: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          symbol: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          symbol?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          currency_id: string;
          balance: number;
          icon: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          currency_id: string;
          balance?: number;
          icon?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: string;
          currency_id?: string;
          balance?: number;
          icon?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_currency_id_fkey";
            columns: ["currency_id"];
            isOneToOne: false;
            referencedRelation: "currencies";
            referencedColumns: ["id"];
          },
        ];
      };
      objectives: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          currency_id: string;
          current_saved: number;
          priority: number;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          currency_id: string;
          current_saved?: number;
          priority?: number;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          currency_id?: string;
          current_saved?: number;
          priority?: number;
          completed?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "objectives_currency_id_fkey";
            columns: ["currency_id"];
            isOneToOne: false;
            referencedRelation: "currencies";
            referencedColumns: ["id"];
          },
        ];
      };
      loans: {
        Row: {
          id: string;
          user_id: string;
          person: string;
          description: string | null;
          amount: number;
          currency_id: string;
          direction: "lent" | "borrowed";
          settled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          person: string;
          description?: string | null;
          amount: number;
          currency_id: string;
          direction: "lent" | "borrowed";
          settled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          person?: string;
          description?: string | null;
          amount?: number;
          currency_id?: string;
          direction?: "lent" | "borrowed";
          settled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "loans_currency_id_fkey";
            columns: ["currency_id"];
            isOneToOne: false;
            referencedRelation: "currencies";
            referencedColumns: ["id"];
          },
        ];
      };
      cash_flows: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          currency_id: string;
          type: "income" | "expense";
          frequency: "one_time" | "daily" | "weekly" | "monthly" | "yearly";
          start_date: string;
          end_date: string | null;
          day_of_month: number | null;
          notes: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          currency_id: string;
          type: "income" | "expense";
          frequency: "one_time" | "daily" | "weekly" | "monthly" | "yearly";
          start_date: string;
          end_date?: string | null;
          day_of_month?: number | null;
          notes?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          currency_id?: string;
          type?: "income" | "expense";
          frequency?: "one_time" | "daily" | "weekly" | "monthly" | "yearly";
          start_date?: string;
          end_date?: string | null;
          day_of_month?: number | null;
          notes?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cash_flows_currency_id_fkey";
            columns: ["currency_id"];
            isOneToOne: false;
            referencedRelation: "currencies";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          amount: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          amount: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          amount?: number;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Currency = Database["public"]["Tables"]["currencies"]["Row"];
export type Account = Database["public"]["Tables"]["accounts"]["Row"];
export type Objective = Database["public"]["Tables"]["objectives"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export type Loan = Database["public"]["Tables"]["loans"]["Row"];

export type AccountWithCurrency = Account & { currencies: Currency };
export type ObjectiveWithCurrency = Objective & { currencies: Currency };
export type LoanWithCurrency = Loan & { currencies: Currency };

export type CashFlow = Database["public"]["Tables"]["cash_flows"]["Row"];
export type CashFlowWithCurrency = CashFlow & { currencies: Currency };
