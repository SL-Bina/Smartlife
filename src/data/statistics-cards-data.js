import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BanknotesIcon,
    titleKey: "statistics.todayMoney.title",
    value: "$53k",
    footer: {
      color: "text-green-500",
      value: "+55%",
      labelKey: "statistics.todayMoney.footer",
    },
  },
  {
    color: "gray",
    icon: UsersIcon,
    titleKey: "statistics.todayUsers.title",
    value: "2,300",
    footer: {
      color: "text-green-500",
      value: "+3%",
      labelKey: "statistics.todayUsers.footer",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    titleKey: "statistics.newClients.title",
    value: "3,462",
    footer: {
      color: "text-red-500",
      value: "-2%",
      labelKey: "statistics.newClients.footer",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    titleKey: "statistics.sales.title",
    value: "$103,430",
    footer: {
      color: "text-green-500",
      value: "+5%",
      labelKey: "statistics.sales.footer",
    },
  },
];

export default statisticsCardsData;
