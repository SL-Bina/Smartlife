import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Select,
  Option,
  Switch,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import {
  BuildingOfficeIcon,
  RectangleStackIcon,
  HomeModernIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

const CreateQueryPage = () => {
  const { t } = useTranslation();
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedApartment, setSelectedApartment] = useState("");
  const [titleAz, setTitleAz] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [descriptionAz, setDescriptionAz] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionRu, setDescriptionRu] = useState("");
  const [questionAz, setQuestionAz] = useState("");
  const [questionEn, setQuestionEn] = useState("");
  const [answers, setAnswers] = useState([{ id: 1, az: "", en: "", ru: "" }]);
  const [multipleAnswers, setMultipleAnswers] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const handleAddAnswer = () => {
    setAnswers([...answers, { id: answers.length + 1, az: "", en: "", ru: "" }]);
  };

  const handleAnswerChange = (id, field, value) => {
    setAnswers(
      answers.map((answer) =>
        answer.id === id ? { ...answer, [field]: value } : answer
      )
    );
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      building: selectedBuilding,
      block: selectedBlock,
      apartment: selectedApartment,
      titles: { az: titleAz, en: titleEn, ru: titleRu },
      descriptions: { az: descriptionAz, en: descriptionEn, ru: descriptionRu },
      questions: { az: questionAz, en: questionEn },
      answers,
      multipleAnswers,
      showResults,
    });
  };

  return (
    <div className="mt-12 mb-8">
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6 dark:bg-black"
        >
          <Typography variant="h6" color="blue-gray" className="dark:text-white">
            {t("queries.create.pageTitle")}
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pb-6 dark:bg-black space-y-6">
          {/* Müvafiq xanaları seçin */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-4 dark:text-gray-300">
              {t("queries.create.selectFields")} <span className="text-red-500">*</span>
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bina */}
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 dark:from-purple-600 dark:to-purple-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-white font-bold">
                      {t("queries.create.building")}
                    </Typography>
                    <Typography variant="small" className="text-white/80">
                      {t("queries.create.residentialBuilding")}
                    </Typography>
                  </div>
                </div>
                <Select
                  label={t("queries.create.select")}
                  value={selectedBuilding}
                  onChange={(val) => setSelectedBuilding(val)}
                  className="bg-white dark:bg-gray-800"
                >
                  <Option value="1">Bina 1</Option>
                  <Option value="2">Bina 2</Option>
                </Select>
              </Card>

              {/* Blok */}
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 dark:from-orange-600 dark:to-orange-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <RectangleStackIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-white font-bold">
                      {t("queries.create.block")}
                    </Typography>
                    <Typography variant="small" className="text-white/80">
                      {t("queries.create.buildingBlock")}
                    </Typography>
                  </div>
                </div>
                <Select
                  label={t("queries.create.select")}
                  value={selectedBlock}
                  onChange={(val) => setSelectedBlock(val)}
                  className="bg-white dark:bg-gray-800"
                >
                  <Option value="1">Blok A</Option>
                  <Option value="2">Blok B</Option>
                </Select>
              </Card>

              {/* Mənzil */}
              <Card className="bg-gradient-to-br from-green-500 to-green-600 p-4 dark:from-green-600 dark:to-green-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <HomeModernIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-white font-bold">
                      {t("queries.create.apartment")}
                    </Typography>
                    <Typography variant="small" className="text-white/80">
                      {t("queries.create.residentialApartment")}
                    </Typography>
                  </div>
                </div>
                <Select
                  label={t("queries.create.select")}
                  value={selectedApartment}
                  onChange={(val) => setSelectedApartment(val)}
                  className="bg-white dark:bg-gray-800"
                >
                  <Option value="1">Mənzil 101</Option>
                  <Option value="2">Mənzil 102</Option>
                </Select>
              </Card>
            </div>
          </div>

          {/* Sorğu başlığı */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-4 dark:text-gray-300">
              {t("queries.create.queryTitle")}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  label={`${t("queries.create.azerbaijani")} *`}
                  placeholder={t("queries.create.azerbaijaniTitle")}
                  value={titleAz}
                  onChange={(e) => setTitleAz(e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
              <div>
                <Input
                  label={`${t("queries.create.english")} *`}
                  placeholder={t("queries.create.englishTitle")}
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
              <div>
                <Input
                  label={`${t("queries.create.russian")} *`}
                  placeholder={t("queries.create.russianTitle")}
                  value={titleRu}
                  onChange={(e) => setTitleRu(e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
            </div>
          </div>

          {/* Sorğu təsviri */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-4 dark:text-gray-300">
              {t("queries.create.queryDescription")}
            </Typography>
            <div className="space-y-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
                  {t("queries.create.azerbaijani")}
                </Typography>
                <textarea
                  placeholder={t("queries.create.azerbaijaniDescription")}
                  value={descriptionAz}
                  onChange={(e) => setDescriptionAz(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                  rows={4}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
                  {t("queries.create.english")}
                </Typography>
                <textarea
                  placeholder={t("queries.create.englishDescription")}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                  rows={4}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
                  {t("queries.create.russian")}
                </Typography>
                <textarea
                  placeholder={t("queries.create.russianDescription")}
                  value={descriptionRu}
                  onChange={(e) => setDescriptionRu(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Sualı daxil edin */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-4 dark:text-gray-300">
              {t("queries.create.enterQuestion")}
            </Typography>
            <div className="space-y-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
                  {t("queries.create.azerbaijani")} *
                </Typography>
                <textarea
                  placeholder={t("queries.create.azerbaijaniQuestion")}
                  value={questionAz}
                  onChange={(e) => setQuestionAz(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                  rows={4}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
                  {t("queries.create.english")} *
                </Typography>
                <textarea
                  placeholder={t("queries.create.englishQuestion")}
                  value={questionEn}
                  onChange={(e) => setQuestionEn(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Cavabları daxil edin */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {t("queries.create.enterAnswers")}
              </Typography>
              <Button
                color="green"
                size="sm"
                onClick={handleAddAnswer}
                className="flex items-center gap-2 dark:bg-green-600 dark:hover:bg-green-700"
              >
                <PlusIcon className="h-4 w-4" />
                <span>{t("queries.create.add")}</span>
              </Button>
            </div>
            <div className="space-y-4">
              {answers.map((answer) => (
                <Card key={answer.id} className="p-4 dark:bg-gray-900">
                  <Typography variant="small" color="orange" className="mb-3 dark:text-orange-400">
                    {t("queries.create.answer")} #{answer.id}
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
                        {t("queries.create.azerbaijani")}
                      </Typography>
                      <Input
                        placeholder={t("queries.create.azerbaijaniAnswer")}
                        value={answer.az}
                        onChange={(e) => handleAnswerChange(answer.id, "az", e.target.value)}
                        className="dark:text-white"
                        labelProps={{ className: "dark:text-gray-400" }}
                      />
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
                        {t("queries.create.english")}
                      </Typography>
                      <Input
                        placeholder={t("queries.create.englishAnswer")}
                        value={answer.en}
                        onChange={(e) => handleAnswerChange(answer.id, "en", e.target.value)}
                        className="dark:text-white"
                        labelProps={{ className: "dark:text-gray-400" }}
                      />
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
                        {t("queries.create.russian")}
                      </Typography>
                      <Input
                        placeholder={t("queries.create.russianAnswer")}
                        value={answer.ru}
                        onChange={(e) => handleAnswerChange(answer.id, "ru", e.target.value)}
                        className="dark:text-white"
                        labelProps={{ className: "dark:text-gray-400" }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sorğu parametrləri */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-4 dark:text-gray-300">
              {t("queries.create.queryParameters")}
            </Typography>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {t("queries.create.multipleAnswerPermission")}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                    {t("queries.create.multipleAnswerDescription")}
                  </Typography>
                </div>
                <Switch
                  checked={multipleAnswers}
                  onChange={(e) => setMultipleAnswers(e.target.checked)}
                  className="dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {t("queries.create.displayResults")}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                    {t("queries.create.displayResultsDescription")}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 mt-1">
                    {t("queries.create.currentValue")}: {showResults ? t("queries.create.active") : t("queries.create.inactive")}
                  </Typography>
                </div>
                <Switch
                  checked={showResults}
                  onChange={(e) => setShowResults(e.target.checked)}
                  className="dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outlined"
              color="blue-gray"
              className="dark:border-gray-600 dark:text-gray-300"
            >
              {t("queries.create.back")}
            </Button>
            <Button
              color="green"
              onClick={handleSubmit}
              className="dark:bg-green-600 dark:hover:bg-green-700"
            >
              {t("queries.create.submit")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateQueryPage;

