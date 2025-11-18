import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";

export function StatisticsChart({
  color,
  chart,
  title,
  description,
  footer,
  titleKey,
  descriptionKey,
  footerKey,
}) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 shadow-sm">
      <CardHeader variant="gradient" color={color} floated={false} shadow={false}>
        <Chart {...chart} />
      </CardHeader>
      <CardBody className="px-6 pt-0">
        <Typography variant="h6" color="blue-gray">
          {titleKey ? t(titleKey) : title}
        </Typography>
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {descriptionKey ? t(descriptionKey) : description}
        </Typography>
      </CardBody>
      {(footer || footerKey) && (
        <CardFooter className="border-t border-blue-gray-50 px-6 py-5">
          {footerKey ? t(footerKey) : footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsChart.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsChart.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  chart: PropTypes.object.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsChart.displayName = "/src/widgets/charts/statistics-chart.jsx";

export default StatisticsChart;
