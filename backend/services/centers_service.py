def get_collection_centers():
    # Return mock collection centers localized to Andhra Pradesh, India.
    # Coordinates are within Lat 15.0 - 17.0 and Lng 79.0 - 82.0.
    # Color-coded markers mapping: Red=Hazardous, Blue=Recycling, Green=Organic, Yellow=E-waste
    return [
        {
            "id": "center_1",
            "name": "Bhimavaram Municipal E-Waste Facility",
            "latitude": 16.5449,
            "longitude": 81.5212,
            "category": "E-waste",
            "color": "yellow",
            "address": "Mavullamma Temple Road, Bhimavaram, Andhra Pradesh 534201",
            "hours": "Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM",
            "acceptedWaste": ["Lithium Batteries", "Old Smartphones", "Laptops", "Cables & Chargers"],
            "phone": "+91 8816 234567"
        },
        {
            "id": "center_2",
            "name": "Kandukur Green Earth Recycling",
            "latitude": 15.2166,
            "longitude": 79.9048,
            "category": "Recycling",
            "color": "blue",
            "address": "Old Bypass Road, Kandukur, Andhra Pradesh 523105",
            "hours": "Mon-Sat: 8:00 AM - 5:00 PM",
            "acceptedWaste": ["Plastic Bottles", "Cardboard", "Newspaper", "Aluminium Cans"],
            "phone": "+91 8598 254321"
        },
        {
            "id": "center_3",
            "name": "Ongole City Hazardous Waste Drop-off",
            "latitude": 15.5057,
            "longitude": 80.0499,
            "category": "Hazardous",
            "color": "red",
            "address": "Trunk Road, Ongole, Andhra Pradesh 523001",
            "hours": "Tue-Thu: 10:00 AM - 4:00 PM",
            "acceptedWaste": ["Lead-Acid Batteries", "Engine Oil", "Pesticide cans", "Solvents"],
            "phone": "+91 8592 221004"
        },
        {
            "id": "center_4",
            "name": "Vijayawada Organic Composting Station",
            "latitude": 16.5062,
            "longitude": 80.6480,
            "category": "Organic",
            "color": "green",
            "address": "Benz Circle, Vijayawada, Andhra Pradesh 520010",
            "hours": "Daily: 6:00 AM - 7:00 PM",
            "acceptedWaste": ["Kitchen scraps", "Fruit & Vegetable peels", "Dry Leaves", "Yard waste"],
            "phone": "+91 866 257789"
        },
        {
            "id": "center_5",
            "name": "Guntur Eco-Waste Hub",
            "latitude": 16.3067,
            "longitude": 80.4365,
            "category": "Recycling",
            "color": "blue",
            "address": "Arundelpet, Guntur, Andhra Pradesh 522002",
            "hours": "Mon-Sat: 8:00 AM - 6:00 PM",
            "acceptedWaste": ["Glass Jars", "Paper bags", "Steel scrap", "Cardboard boxes"],
            "phone": "+91 863 223400"
        },
        {
            "id": "center_6",
            "name": "Bhimavaram Green Composting Station",
            "latitude": 16.5492,
            "longitude": 81.5255,
            "category": "Organic",
            "color": "green",
            "address": "JP Road, Bhimavaram, Andhra Pradesh 534202",
            "hours": "Daily: 7:00 AM - 6:00 PM",
            "acceptedWaste": ["Organic Food Scraps", "Flowers & Plants", "Biodegradable packaging"],
            "phone": "+91 8816 298765"
        },
        {
            "id": "center_7",
            "name": "Kandukur E-Waste Station",
            "latitude": 15.2120,
            "longitude": 79.9070,
            "category": "E-waste",
            "color": "yellow",
            "address": "Railway Station Road, Kandukur, Andhra Pradesh 523105",
            "hours": "Mon-Fri: 9:00 AM - 5:00 PM",
            "acceptedWaste": ["Computer components", "Televisions", "Kitchen appliances"],
            "phone": "+91 8598 259999"
        }
    ]
