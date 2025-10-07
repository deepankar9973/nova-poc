import { ReactNode } from 'react';

export type MVComponentType =
  | 'Accordion'
  | 'AlertCard'
  | 'Autocomplete'
  | 'Badge'
  | 'Button'
  | 'Card'
  | 'Checkbox'
  | 'Chip'
  | 'ChipContainer'
  | 'Dialog'
  | 'FileUpload'
  | 'GroupedCheckbox'
  | 'Icon'
  | 'LineDivider'
  | 'List'
  | 'NoticeBar'
  | 'OTP'
  | 'PlanSelector'
  | 'RadioButton'
  | 'RadioPlanSelector'
  | 'Slider'
  | 'Snackbar'
  | 'StatusCard'
  | 'Stepper'
  | 'Tab'
  | 'Tag'
  | 'TextField'
  | 'Title'
  | 'Toggle'
  | 'Tooltip'
  | 'Typography';

// Common types
type Size = 'small' | 'medium' | 'large';
type Variant = 'primary' | 'secondary' | 'text' | 'outlined';
type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface MVComponentProps {
  Accordion: {
    title: string;
    children: ReactNode;
    isOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
    className?: string;
  };

  AlertCard: {
    type: AlertType;
    message: string;
    onClose?: () => void;
    className?: string;
    icon?: ReactNode;
  };

  Autocomplete: {
    options: Array<{ label: string; value: string }>;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
  };

  Badge: {
    text: string;
    variant?: Variant;
    size?: Size;
    className?: string;
  };

  Button: {
    text: string;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    onClick?: () => void;
    fullWidth?: boolean;
    icon?: ReactNode;
    loading?: boolean;
  };

  Card: {
    children: ReactNode;
    className?: string;
    elevation?: number;
    onClick?: () => void;
  };

  Checkbox: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    error?: string;
    className?: string;
  };

  Chip: {
    label: string;
    selected?: boolean;
    onSelect?: () => void;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
  };

  ChipContainer: {
    children: ReactNode;
    className?: string;
    spacing?: number;
  };

  Dialog: {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    actions?: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  };

  FileUpload: {
    onUpload: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    error?: string;
    label?: string;
  };

  GroupedCheckbox: {
    options: Array<{ label: string; value: string }>;
    value: string[];
    onChange: (value: string[]) => void;
    label?: string;
    error?: string;
  };

  Icon: {
    name: string;
    size?: Size;
    color?: string;
    className?: string;
  };

  LineDivider: {
    variant?: 'horizontal' | 'vertical';
    className?: string;
  };

  List: {
    items: Array<{ id: string; content: ReactNode }>;
    onItemClick?: (id: string) => void;
    className?: string;
  };

  NoticeBar: {
    message: string;
    type?: AlertType;
    onClose?: () => void;
    duration?: number;
  };

  OTP: {
    length: number;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
  };

  PlanSelector: {
    plans: Array<{
      id: string;
      title: string;
      description: string;
      amount: number;
      selected?: boolean;
    }>;
    onSelect: (id: string) => void;
  };

  RadioButton: {
    options: Array<{ label: string; value: string }>;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    error?: string;
    disabled?: boolean;
  };

  RadioPlanSelector: {
    options: Array<{
      label: string;
      value: string;
      description?: string;
      amount?: number;
    }>;
    value: string;
    onChange: (value: string) => void;
    error?: string;
  };

  Slider: {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    step?: number;
    label?: string;
    marks?: boolean;
    disabled?: boolean;
  };

  Snackbar: {
    message: string;
    open: boolean;
    onClose: () => void;
    type?: AlertType;
    duration?: number;
  };

  StatusCard: {
    status: AlertType;
    title: string;
    message: string;
    action?: ReactNode;
  };

  Stepper: {
    steps: Array<{ label: string; completed?: boolean }>;
    activeStep: number;
    orientation?: 'horizontal' | 'vertical';
  };

  Tab: {
    tabs: Array<{ label: string; value: string }>;
    value: string;
    onChange: (value: string) => void;
    variant?: 'standard' | 'fullWidth';
  };

  Tag: {
    label: string;
    onDelete?: () => void;
    color?: string;
    size?: Size;
  };

  TextField: {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    type?: 'text' | 'password' | 'number' | 'email' | 'tel';
    error?: string;
    helperText?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    multiline?: boolean;
    rows?: number;
  };

  Title: {
    text: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
  };

  Toggle: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
  };

  Tooltip: {
    title: string;
    children: ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
  };

  Typography: {
    text: string;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
    color?: string;
    className?: string;
  };
}