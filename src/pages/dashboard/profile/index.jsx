import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Input,
  Button,
  Chip,
} from "@material-tailwind/react";
import {
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: "Smart",
    lastName: "Lıfe",
    birthDate: "1990-01-01",
    address: "Baku",
    phone: "0123456789",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePersonalInfoChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = () => {
    // Save personal information
    console.log("Saving personal info:", formData);
  };

  const handleSavePassword = () => {
    // Save password
    console.log("Saving password");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">Profil</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - User Information */}
        <Card className="border border-red-500 shadow-sm">
          <CardBody className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">
                  R
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <Typography variant="h5" color="blue-gray" className="mb-4 font-bold">
                Test User
              </Typography>
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="h-5 w-5 text-blue-gray-400" />
                  <Typography variant="small" color="blue-gray">
                    admin@mail.az
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-blue-gray-400" />
                  <Typography variant="small" color="blue-gray">
                    {formData.phone}
                  </Typography>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-gray-100">
                  <Chip
                    value="West"
                    color="green"
                    icon={<HomeIcon className="h-4 w-4" />}
                    className="w-full justify-start"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Right Panel - Personal Information Editing */}
        <div className="lg:col-span-2">
          <Card className="border border-red-500 shadow-sm">
            <CardBody className="p-6">
              <Tabs value={activeTab} className="overflow-visible">
                <TabsHeader className="rounded-none border-b border-blue-gray-100 bg-transparent p-0">
                  <Tab
                    value="personal"
                    onClick={() => setActiveTab("personal")}
                    className={
                      activeTab === "personal"
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : ""
                    }
                  >
                    Şəxsi məlumatlar
                  </Tab>
                  <Tab
                    value="password"
                    onClick={() => setActiveTab("password")}
                    className={
                      activeTab === "password"
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : ""
                    }
                  >
                    Şifrəm
                  </Tab>
                </TabsHeader>
                <TabsBody className="mt-6">
                  <TabPanel value="personal" className="p-0">
                    <Typography variant="h6" color="blue-gray" className="mb-6 font-bold">
                      Şəxsi məlumatlar
                    </Typography>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-1">
                            Ad
                          </Typography>
                          <Input
                            label="Daxil et"
                            value={formData.firstName}
                            onChange={(e) =>
                              handlePersonalInfoChange("firstName", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-1">
                            Soyad
                          </Typography>
                          <Input
                            label="Daxil et"
                            value={formData.lastName}
                            onChange={(e) =>
                              handlePersonalInfoChange("lastName", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1">
                          Doğum tarixi
                        </Typography>
                        <Input
                          type="date"
                          label="Daxil et"
                          value={formData.birthDate}
                          onChange={(e) =>
                            handlePersonalInfoChange("birthDate", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1">
                          Ünvan
                        </Typography>
                        <Input
                          label="Daxil et"
                          value={formData.address}
                          onChange={(e) =>
                            handlePersonalInfoChange("address", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1">
                          Telefon
                        </Typography>
                        <Input
                          label="Daxil et"
                          value={formData.phone}
                          onChange={(e) =>
                            handlePersonalInfoChange("phone", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button color="blue" onClick={handleSavePersonalInfo}>
                          Yadda saxla
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value="password" className="p-0">
                    <Typography variant="h6" color="blue-gray" className="mb-6 font-bold">
                      Şifrəm
                    </Typography>
                    <div className="space-y-4">
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1">
                          Cari şifrə
                        </Typography>
                        <Input
                          type="password"
                          label="Daxil et"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            handlePasswordChange("currentPassword", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1">
                          Yeni şifrə
                        </Typography>
                        <Input
                          type="password"
                          label="Daxil et"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            handlePasswordChange("newPassword", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1">
                          Yeni şifrəni təsdiq et
                        </Typography>
                        <Input
                          type="password"
                          label="Daxil et"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            handlePasswordChange("confirmPassword", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button color="blue" onClick={handleSavePassword}>
                          Yadda saxla
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                </TabsBody>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
