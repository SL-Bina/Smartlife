import {
  BanknotesIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CheckCircleIcon,
  CreditCardIcon,
  UserMinusIcon,
  BuildingOfficeIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

export const iconMap = {
  BanknotesIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CheckCircleIcon,
  CreditCardIcon,
  UserMinusIcon,
  BuildingOfficeIcon,
  HomeIcon,
};

export const getIconComponent = (iconName) => {
  return iconMap[iconName];
};
