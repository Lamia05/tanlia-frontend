import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Check,
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const addressRef = useRef(null);

  const [cart, setCart] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddressSuggestions, setShowAddressSuggestions] =
    useState(false);

  const [deliveryLocation, setDeliveryLocation] =
    useState("insideDhaka");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const addressSuggestions = [
    // Dhaka
    "Dhaka",
    "Mirpur",
    "Pallabi",
    "Kazipara",
    "Shewrapara",
    "Rupnagar",
    "Kallyanpur",
    "Darus Salam",
    "Agargaon",
    "Mohammadpur",
    "Adabor",
    "Shyamoli",
    "Asad Gate",
    "Bosila",
    "Dhanmondi",
    "Jigatola",
    "Kalabagan",
    "Lalmatia",
    "New Market",
    "Hazaribagh",
    "Uttara",
    "Uttara Sector 1",
    "Uttara Sector 3",
    "Uttara Sector 4",
    "Uttara Sector 7",
    "Uttara Sector 10",
    "Uttara Sector 11",
    "Uttara Sector 12",
    "Airport",
    "Dakshinkhan",
    "Uttarkhan",
    "Abdullahpur",
    "Khilkhet",
    "Nikunja",
    "Bashundhara",
    "Bashundhara Residential Area",
    "Baridhara",
    "Gulshan",
    "Gulshan 1",
    "Gulshan 2",
    "Banani",
    "Niketan",
    "Mohakhali",
    "Tejgaon",
    "Farmgate",
    "Karwan Bazar",
    "Badda",
    "Merul Badda",
    "Aftabnagar",
    "Rampura",
    "Hatirjheel",
    "Khilgaon",
    "Malibagh",
    "Moghbazar",
    "Mouchak",
    "Shantinagar",
    "Paltan",
    "Motijheel",
    "Kakrail",
    "Jatrabari",
    "Sayedabad",
    "Dania",
    "Demra",
    "Basabo",
    "Wari",
    "Old Dhaka",
    "Lalbagh",
    "Azimpur",
    "Islampur",
    "Sadarghat",

    // Savar
    "Savar",
    "Savar Bazar",
    "Hemayetpur",
    "Aminbazar",
    "Nabinagar",
    "Baipayl",
    "Ashulia",
    "Zirabo",
    "Jamgora",
    "Dhamsona",
    "Yearpur",
    "Kathgara",
    "BEPZA",
    "DEPZ",
    "Birulia",
    "Tetuljhora",
    "Bank Town",

    // Gazipur
    "Tongi",
    "Gazipur",
    "Joydebpur",
    "Board Bazar",
    "Chandana",
    "Konabari",
    "Kashimpur",
    "Pubail",
    "Kapasia",
    "Sreepur",
    "Mawna",
    "Kaliganj",
    "Bason",
    "Salna",

    // Narayanganj
    "Narayanganj",
    "Chashara",
    "Fatullah",
    "Siddhirganj",
    "Shibu Market",
    "Pagla",
    "Kanchpur",
    "Rupganj",
    "Araihazar",
    "Sonargaon",

    // Chattogram
    "Chattogram",
    "Agrabad",
    "GEC Circle",
    "Panchlaish",
    "Nasirabad",
    "Muradpur",
    "Oxygen",
    "Khulshi",
    "Halishahar",
    "EPZ Chattogram",
    "Patenga",
    "Bakalia",
    "Chawkbazar Chattogram",
    "Kotwali Chattogram",
    "Anderkilla",
    "Bahaddarhat",
    "Chandgaon",
    "Bayezid",
    "Hathazari",
    "Sitakunda",
    "Mirsharai",
    "Patiya",
    "Raozan",
    "Boalkhali",
    "Anwara",
    "Fatikchhari",

    // Cox's Bazar
    "Cox's Bazar",
    "Kolatoli",
    "Sugandha Point",
    "Laboni Point",
    "Ramu",
    "Chakaria",
    "Teknaf",
    "Ukhia",
    "Pekua",

    // Sylhet
    "Sylhet",
    "Zindabazar",
    "Amberkhana",
    "Shibgonj Sylhet",
    "Uposhohor Sylhet",
    "Mirabazar",
    "Subid Bazar",
    "Lamabazar",
    "Bandar Bazar",
    "Tilagor",
    "South Surma",
    "Beanibazar",
    "Golapganj",
    "Zakiganj",
    "Jaintapur",
    "Companiganj Sylhet",
    "Kanaighat",
    "Bishwanath",
    "Balaganj",
    "Fenchuganj",
    "Osmani Nagar",

    // Rajshahi
    "Rajshahi",
    "Shaheb Bazar",
    "Boalia",
    "Kazla Rajshahi",
    "Motihar",
    "Talaimari",
    "Laxmipur Rajshahi",
    "Railgate Rajshahi",
    "Rajpara",
    "Paba",
    "Godagari",
    "Tanore",
    "Puthia",
    "Durgapur Rajshahi",
    "Bagha",
    "Charghat",
    "Mohanpur",
    "Bagmara",

    // Khulna
    "Khulna",
    "Sonadanga",
    "Khalishpur",
    "Boyra",
    "Daulatpur Khulna",
    "Nirala",
    "Moylapota",
    "Shibbari",
    "Rupsha",
    "Dumuria",
    "Batiaghata",
    "Paikgachha",
    "Koyra",
    "Dighalia",
    "Terokhada",

    // Barishal
    "Barishal",
    "Nathullabad",
    "Rupatali",
    "Sadar Road Barishal",
    "Band Road Barishal",
    "Kawnia",
    "Sagardi",
    "Bakerganj",
    "Banaripara",
    "Wazirpur",
    "Mehendiganj",
    "Hizla",
    "Muladi",
    "Agailjhara",

    // Rangpur
    "Rangpur",
    "Jahaj Company More",
    "Dhap",
    "Modern More Rangpur",
    "Mithapukur",
    "Pirganj Rangpur",
    "Badarganj",
    "Kaunia",
    "Gangachara",
    "Taraganj",
    "Pirgachha",
    "Haragach",

    // Mymensingh
    "Mymensingh",
    "Ganginarpar",
    "Town Hall Mymensingh",
    "Charpara",
    "Maskanda",
    "Shambhuganj",
    "Kewatkhali",
    "Trishal",
    "Muktagachha",
    "Bhaluka",
    "Gaffargaon",
    "Fulbaria Mymensingh",
    "Ishwarganj",
    "Nandail",
    "Haluaghat",

    // Cumilla
    "Cumilla",
    "Kandirpar",
    "Tomchom Bridge",
    "Race Course Cumilla",
    "Kotbari",
    "Daudkandi",
    "Burichang",
    "Brahmanpara",
    "Chandina",
    "Debidwar",
    "Homna",
    "Laksam",
    "Muradnagar",
    "Nangalkot",
    "Chauddagram",

    // Bogura
    "Bogura",
    "Satmatha",
    "Thanthania",
    "Sherpur Bogura",
    "Nawab Bari Road",
    "Matidali",
    "Shibganj Bogura",
    "Sonatola",
    "Gabtali",
    "Sariakandi",
    "Adamdighi",
    "Dupchanchia",
    "Kahaloo",

    // Jashore
    "Jashore",
    "Jessore",
    "Monihar",
    "Chanchra",
    "Palbari",
    "Rail Road Jashore",
    "Noapara",
    "Jhikargachha",
    "Sharsha",
    "Manirampur",
    "Keshabpur",
    "Bagherpara",
    "Abhaynagar",

    // Dinajpur
    "Dinajpur",
    "Pulhat",
    "Munshipara Dinajpur",
    "Birganj",
    "Parbatipur",
    "Phulbari Dinajpur",
    "Birampur",
    "Nawabganj Dinajpur",
    "Ghoraghat",

    // Tangail
    "Tangail",
    "Akurtakur",
    "Old Bus Stand Tangail",
    "Kalihati",
    "Mirzapur Tangail",
    "Ghatail",
    "Madhupur Tangail",
    "Dhanbari",
    "Bhuapur",
    "Delduar",

    // Faridpur
    "Faridpur",
    "Goalchamat",
    "Kanaipur",
    "Bhanga",
    "Boalmari",
    "Nagarkanda",
    "Madhukhali",
    "Alfadanga",
    "Sadarpur Faridpur",

    // Pabna
    "Pabna",
    "Shalgaria",
    "Ataikula",
    "Ishwardi",
    "Bera",
    "Santhia",
    "Chatmohar",
    "Sujanagar",

    // Narsingdi
    "Narsingdi",
    "Madhabdi",
    "Palash Narsingdi",
    "Shibpur Narsingdi",
    "Raipura Narsingdi",
    "Belabo",

    // Kishoreganj
    "Kishoreganj",
    "Bhairab",
    "Kuliarchar",
    "Karimganj Kishoreganj",
    "Pakundia",
    "Hossainpur",
    "Bajitpur",

    // Feni
    "Feni",
    "Mohipal",
    "Trunk Road Feni",
    "Sonagazi",
    "Daganbhuiyan",
    "Parshuram",
    "Chagalnaiya",

    // Noakhali
    "Noakhali",
    "Maijdee",
    "Sonapur Noakhali",
    "Begumganj",
    "Chatkhil",
    "Senbagh",
    "Sonaimuri",
    "Companiganj Noakhali",
    "Subarnachar",

    // Brahmanbaria
    "Brahmanbaria",
    "Ashuganj",
    "Kasba",
    "Nabinagar Brahmanbaria",
    "Sarail",
    "Nasirnagar",
    "Bancharampur",

    // Habiganj
    "Habiganj",
    "Shaistaganj",
    "Madhabpur Habiganj",
    "Chunarughat",
    "Nabiganj Habiganj",
    "Bahubal",

    // Moulvibazar
    "Moulvibazar",
    "Sreemangal",
    "Kulaura",
    "Barlekha",
    "Rajnagar Moulvibazar",
    "Kamalganj",

    // Kushtia
    "Kushtia",
    "Kumarkhali",
    "Mirpur Kushtia",
    "Bheramara",
    "Daulatpur Kushtia",
    "Khoksa",

    // Jhenaidah
    "Jhenaidah",
    "Kaliganj Jhenaidah",
    "Shailkupa",
    "Harinakundu",
    "Kotchandpur",

    // Satkhira
    "Satkhira",
    "Kalaroa",
    "Tala Satkhira",
    "Shyamnagar",
    "Kaliganj Satkhira",
    "Assasuni",

    // Bagerhat
    "Bagerhat",
    "Mongla",
    "Fakirhat",
    "Mollahat",
    "Rampal",
    "Morrelganj",
    "Sharankhola",

    // Patuakhali
    "Patuakhali",
    "Kuakata",
    "Kalapara",
    "Bauphal",
    "Galachipa",
    "Mirzaganj",
    "Dumki",

    // Bhola
    "Bhola",
    "Borhanuddin",
    "Lalmohan",
    "Char Fasson",
    "Daulatkhan",
    "Tazumuddin",
    "Monpura",

    // Madaripur
    "Madaripur",
    "Shibchar",
    "Rajoir",
    "Kalkini",

    // Gopalganj
    "Gopalganj",
    "Tungipara",
    "Kashiani",
    "Kotalipara",
    "Muksudpur",

    // Shariatpur
    "Shariatpur",
    "Zajira",
    "Naria",
    "Bhedarganj",
    "Gosairhat",
    "Damudya",

    // Chandpur
    "Chandpur",
    "Hajiganj",
    "Shahrasti",
    "Matlab",
    "Faridganj",
    "Kachua Chandpur",
    "Haimchar",

    // Lakshmipur
    "Lakshmipur",
    "Raipur Lakshmipur",
    "Ramganj",
    "Ramgati",
    "Kamalnagar",

    // Manikganj
    "Manikganj",
    "Singair",
    "Saturia",
    "Shibalaya",
    "Ghior",
    "Harirampur",
    "Daulatpur Manikganj",

    // Munshiganj
    "Munshiganj",
    "Muktarpur",
    "Sreenagar",
    "Lohajang",
    "Tongibari",
    "Sirajdikhan",

    // Jamalpur
    "Jamalpur",
    "Melandaha",
    "Islampur Jamalpur",
    "Sarishabari",
    "Madarganj",
    "Dewanganj",
    "Baksiganj",

    // Sherpur
    "Sherpur",
    "Nalitabari",
    "Sreebardi",
    "Nakla",
    "Jhenaigati",

    // Netrokona
    "Netrokona",
    "Madan Netrokona",
    "Mohanganj",
    "Durgapur Netrokona",
    "Kendua",
    "Purbadhala",

    // Naogaon
    "Naogaon",
    "Manda",
    "Raninagar",
    "Atrai",
    "Patnitala",
    "Dhamoirhat",
    "Sapahar",
    "Niamatpur",

    // Natore
    "Natore",
    "Baraigram",
    "Gurudaspur",
    "Singra Natore",
    "Bagatipara",
    "Lalpur Natore",

    // Chapainawabganj
    "Chapainawabganj",
    "Shibganj Chapainawabganj",
    "Gomastapur",
    "Nachole",
    "Bholahat",

    // Sirajganj
    "Sirajganj",
    "Shahjadpur",
    "Ullapara",
    "Belkuchi",
    "Kazipur Sirajganj",
    "Raiganj Sirajganj",
    "Kamarkhanda",

    // Joypurhat
    "Joypurhat",
    "Panchbibi",
    "Akkelpur",
    "Kalai",
    "Khetlal",

    // Lalmonirhat
    "Lalmonirhat",
    "Patgram",
    "Hatibandha",
    "Kaliganj Lalmonirhat",
    "Aditmari",

    // Nilphamari
    "Nilphamari",
    "Saidpur",
    "Domar",
    "Dimla",
    "Jaldhaka",
    "Kishoreganj Nilphamari",

    // Kurigram
    "Kurigram",
    "Nageshwari",
    "Ulipur",
    "Bhurungamari",
    "Chilmari",
    "Rajarhat",
    "Rowmari",

    // Gaibandha
    "Gaibandha",
    "Palashbari",
    "Sundarganj",
    "Gobindaganj",
    "Fulchhari",
    "Sadullapur",

    // Panchagarh
    "Panchagarh",
    "Tetulia",
    "Boda",
    "Debiganj",
    "Atwari",

    // Thakurgaon
    "Thakurgaon",
    "Pirganj Thakurgaon",
    "Ranisankail",
    "Baliadangi",
    "Haripur",

    // Pirojpur
    "Pirojpur",
    "Mathbaria",
    "Bhandaria",
    "Nazirpur",
    "Kawkhali Pirojpur",

    // Jhalokathi
    "Jhalokathi",
    "Nalchity",
    "Kathalia",
    "Rajapur Jhalokathi",
  ];

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("tanliaCart") || "[]"
    );

    setCart(Array.isArray(savedCart) ? savedCart : []);
  }, []);

  useEffect(() => {
    fetch("/data/sellers.json")
      .then((res) => res.json())
      .then((data) => {
        setSellers(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error loading sellers:", error);
      });
  }, []);

  // Close address dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addressRef.current &&
        !addressRef.current.contains(event.target)
      ) {
        setShowAddressSuggestions(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const getNumericPrice = (price) => {
    if (!price) return 0;

    const number = String(price).replace(/[^0-9.]/g, "");

    return Number(number) || 0;
  };

  const getSellerDelivery = (sellerName) => {
    if (!sellerName) return null;

    return sellers.find(
      (seller) =>
        seller.name?.toLowerCase() ===
        sellerName?.toLowerCase()
    );
  };

  const uniqueSellers = [
    ...new Set(
      cart
        .map((item) => item.seller || item.sellerName)
        .filter(Boolean)
    ),
  ];

  const subtotal = cart.reduce((sum, item) => {
    const price = getNumericPrice(item.price);
    const quantity = item.quantity || 1;

    return sum + price * quantity;
  }, 0);

  const deliveryDetails = uniqueSellers.map((sellerName) => {
    const seller = getSellerDelivery(sellerName);

    const charge =
      deliveryLocation === "insideDhaka"
        ? seller?.delivery?.insideDhaka || 0
        : seller?.delivery?.outsideDhaka || 0;

    return {
      sellerName,
      charge,
    };
  });

  const deliveryTotal = deliveryDetails.reduce(
    (sum, item) => sum + item.charge,
    0
  );

  const total = subtotal + deliveryTotal;

  const filteredSuggestions = formData.address.trim()
    ? addressSuggestions
        .filter((area) =>
          area
            .toLowerCase()
            .includes(formData.address.trim().toLowerCase())
        )
        .slice(0, 8)
    : [];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");

    if (name === "address") {
      setShowAddressSuggestions(true);
    }
  };

  const handleAddressSuggestion = (area) => {
    setFormData((prev) => ({
      ...prev,
      address: area,
    }));

    setShowAddressSuggestions(false);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setShowAddressSuggestions(false);

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address
    ) {
      setErrorMessage(
        "Please fill in all customer information."
      );
      return;
    }

    if (!cart.length) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const order = {
      id: `TL-${Date.now()}`,
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      },
      deliveryLocation,
      items: cart,
      subtotal,
      delivery: deliveryDetails,
      deliveryTotal,
      total,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };

    try {
      const response = await fetch(
        "https://tanlia-backend.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order."
        );
      }

      const savedOrder = data.order || order;

      localStorage.setItem(
        "tanliaLastOrder",
        JSON.stringify(savedOrder)
      );

      setPlacedOrder(savedOrder);

      localStorage.removeItem("tanliaCart");

      window.dispatchEvent(new Event("cartUpdated"));

      setOrderPlaced(true);
    } catch (error) {
      console.error("Order submission error:", error);

      setErrorMessage(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
            <ShoppingBag
              size={50}
              strokeWidth={1.2}
              className="mb-5 text-gray-500"
            />

            <h1 className="text-2xl font-medium mb-2">
              Your cart is empty
            </h1>

            <p className="text-gray-500 mb-7">
              Add some products before proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="bg-black text-white px-7 py-3 text-sm flex items-center gap-2 hover:bg-gray-800 transition"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
          <div className="bg-white border border-gray-200 p-8 md:p-12 text-center">

            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={28} />
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-[#B85028] mb-3">
              Tanlia Studio
            </p>

            <h1 className="text-3xl md:text-4xl font-light mb-4">
              Order Placed
            </h1>

            <p className="text-gray-500 leading-6 mb-6">
              Thank you for your order. We have received your
              order details successfully.
            </p>

            {placedOrder?.orderId && (
              <div className="border border-gray-200 bg-[#FDFBF7] px-5 py-4 mb-8">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Your Order ID
                </p>

                <p className="text-lg font-medium mt-2">
                  {placedOrder.orderId}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-3">

              {placedOrder?.orderId && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/track-order?orderId=${encodeURIComponent(
                        placedOrder.orderId
                      )}`
                    )
                  }
                  className="bg-black text-white px-7 py-3 text-sm hover:bg-[#B85028] transition"
                >
                  Track Order
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate("/my-orders")}
                className="border border-black text-black px-7 py-3 text-sm hover:bg-black hover:text-white transition"
              >
                My Orders
              </button>

            </div>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-5 text-sm text-gray-500 hover:text-black transition"
            >
              Continue Shopping
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex items-center gap-3 mb-10">
          <ShoppingBag size={24} />

          <h1 className="text-3xl md:text-4xl font-semibold">
            Checkout
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >

          {/* Customer Information */}

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white border border-gray-200 p-6 md:p-8">

              <h2 className="text-xl font-semibold mb-6">
                Customer Information
              </h2>

              <div className="space-y-5">

                <div>
                  <label className="block text-sm mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full h-12 border border-gray-300 px-4 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full h-12 border border-gray-300 px-4 text-sm outline-none focus:border-black"
                  />
                </div>

                <div
                  ref={addressRef}
                  className="relative"
                >
                  <label className="block text-sm mb-2">
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onFocus={() => {
                      if (formData.address.trim()) {
                        setShowAddressSuggestions(true);
                      }
                    }}
                    placeholder="Enter your complete delivery address"
                    required
                    rows={4}
                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none resize-none focus:border-black"
                  />

                  {showAddressSuggestions &&
                    filteredSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-30 bg-white border border-gray-200 shadow-lg max-h-64 overflow-y-auto">

                        {filteredSuggestions.map(
                          (area, index) => (
                            <button
                              key={`${area}-${index}`}
                              type="button"
                              onMouseDown={(event) => {
                                event.preventDefault();
                                handleAddressSuggestion(area);
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-[#FDFBF7] border-b border-gray-100 last:border-b-0 transition"
                            >
                              {area}
                            </button>
                          )
                        )}

                      </div>
                    )}

                  <p className="text-xs text-gray-400 mt-2">
                    Start typing your area to see nearby location
                    suggestions.
                  </p>
                </div>

              </div>
            </div>

            {/* Delivery Location */}

            <div className="bg-white border border-gray-200 p-6 md:p-8">

              <h2 className="text-xl font-semibold mb-6">
                Delivery Location
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setDeliveryLocation("insideDhaka")
                  }
                  className={`p-4 border text-left transition ${
                    deliveryLocation === "insideDhaka"
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  <p className="text-sm font-medium">
                    Inside Dhaka
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      deliveryLocation === "insideDhaka"
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    Seller-wise delivery charge
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDeliveryLocation("outsideDhaka")
                  }
                  className={`p-4 border text-left transition ${
                    deliveryLocation === "outsideDhaka"
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  <p className="text-sm font-medium">
                    Outside Dhaka
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      deliveryLocation === "outsideDhaka"
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    Seller-wise delivery charge
                  </p>
                </button>

              </div>
            </div>
          </div>

          {/* Order Summary */}

          <div>
            <div className="bg-white border border-gray-200 p-6 sticky top-28">

              <h2 className="text-xl font-semibold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">

                {cart.map((item, index) => {
                  const image = Array.isArray(item.image)
                    ? item.image[0]
                    : item.image;

                  const quantity = item.quantity || 1;

                  return (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex gap-3"
                    >

                      <div className="w-16 h-20 bg-gray-100 shrink-0 overflow-hidden">
                        {image && (
                          <img
                            src={image}
                            alt={item.title || "Product"}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="text-sm line-clamp-2">
                          {item.title || "Product"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {quantity}
                        </p>

                        <p className="text-xs text-gray-500">
                          {item.seller ||
                            item.sellerName ||
                            ""}
                        </p>

                      </div>

                      <p className="text-sm">
                        BDT{" "}
                        {(
                          getNumericPrice(item.price) *
                          quantity
                        ).toLocaleString()}
                      </p>

                    </div>
                  );
                })}

              </div>

              <div className="border-t border-gray-200 pt-5">

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span>
                    BDT {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="mb-5">

                  <p className="text-sm text-gray-600 mb-3">
                    Delivery
                  </p>

                  <div className="space-y-2">

                    {deliveryDetails.map((item) => (
                      <div
                        key={item.sellerName}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-500">
                          {item.sellerName}
                        </span>

                        <span>
                          BDT {item.charge.toLocaleString()}
                        </span>
                      </div>
                    ))}

                  </div>
                </div>

                <div className="border-t border-gray-200 pt-5 flex items-center justify-between">

                  <span className="font-medium">
                    Total
                  </span>

                  <span className="text-lg font-semibold">
                    BDT {total.toLocaleString()}
                  </span>

                </div>

                {errorMessage && (
                  <p className="text-sm text-red-600 mt-4">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white py-4 mt-6 text-sm font-medium transition ${
                    isSubmitting
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {isSubmitting
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

              </div>
            </div>
          </div>

        </form>
      </section>
    </div>
  );
};

export default Checkout;