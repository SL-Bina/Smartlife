// Lottie animation data loader
// Bu faylda animasiya fayllarını import edin və export edin

// Nümunə: Animasiya fayllarını import edin
// import homeAnimation from '/lottie/home.json';
// import financeAnimation from '/lottie/finance.json';

// Və ya fetch ilə yükləyin
export const loadLottieAnimation = async (path) => {
  try {
    const response = await fetch(path);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading animation from ${path}:`, error);
    // Fallback: sadə bir animasiya qaytar
    return {
      v: "5.7.4",
      fr: 30,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      nm: "Placeholder",
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "Shape",
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [50, 50, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: {
              a: 1,
              k: [
                { i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 0, s: [100, 100, 100] },
                { i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 30, s: [120, 120, 120] },
                { t: 60, s: [100, 100, 100] }
              ],
              ix: 6
            }
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              it: [
                { d: 1, ty: "el", s: { a: 0, k: [40, 40] }, p: { a: 0, k: [0, 0] }, nm: "Ellipse Path 1" },
                { ty: "st", c: { a: 0, k: [0.2, 0.4, 0.8, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 }, lc: 2, lj: 1, ml: 4, bm: 0, nm: "Stroke 1" },
                { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: "Transform" }
              ],
              nm: "Ellipse 1",
              bm: 0
            }
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0
        }
      ],
      markers: []
    };
  }
};

// Animasiya fayllarının yolları
export const animationPaths = {
  home: "/lottie/home.json",
  finance: "/lottie/finance.json",
  invoices: "/lottie/invoices.json",
  paymentHistory: "/lottie/payment-history.json",
  reports: "/lottie/reports.json",
  debtorApartments: "/lottie/debtor-apartments.json",
  expenses: "/lottie/expenses.json",
  notifications: "/lottie/notifications.json",
  buildingManagement: "/lottie/building-management.json",
  mtk: "/lottie/mtk.json",
  complexes: "/lottie/complexes.json",
  buildings: "/lottie/buildings.json",
  blocks: "/lottie/blocks.json",
  properties: "/lottie/properties.json",
  residents: "/lottie/residents.json",
  apartmentGroups: "/lottie/apartment-groups.json",
  profile: "/lottie/profile.json",
};

