def get_collection_centers():
    # Return mock collection centers with coordinates, color-coded categories, and detailed information.
    # Color-coded markers mapping: Red=Hazardous, Blue=Recycling, Green=Organic, Yellow=E-waste
    return [
        {
            "id": "center_1",
            "name": "Downtown Eco Recycling Hub",
            "latitude": 40.730610,
            "longitude": -73.935242,
            "category": "Recycling",
            "color": "blue",
            "address": "456 Recycling Ave, Queens, NY 11101",
            "hours": "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM",
            "acceptedWaste": ["Plastic Bottles", "Cardboard", "Aluminium Cans", "Glass Jars"],
            "phone": "+1 (555) 123-4567"
        },
        {
            "id": "center_2",
            "name": "Metropolitan Hazardous Waste Facility",
            "latitude": 40.706086,
            "longitude": -73.996864,
            "category": "Hazardous",
            "color": "red",
            "address": "12 Safety Way, Brooklyn, NY 11201",
            "hours": "Tue-Thu: 9:00 AM - 5:00 PM, Sat: 10:00 AM - 2:00 PM",
            "acceptedWaste": ["Lithium Batteries", "Motor Oil", "Paint cans", "Household Cleaners"],
            "phone": "+1 (555) 987-6543"
        },
        {
            "id": "center_3",
            "name": "GreenLife Organic Composting Center",
            "latitude": 40.758896,
            "longitude": -73.985130,
            "category": "Organic",
            "color": "green",
            "address": "789 Compost Lane, Manhattan, NY 10036",
            "hours": "Daily: 7:00 AM - 7:00 PM",
            "acceptedWaste": ["Food Scraps", "Yard Trimmings", "Biodegradable paper"],
            "phone": "+1 (555) 246-8102"
        },
        {
            "id": "center_4",
            "name": "FutureTech E-Waste Depository",
            "latitude": 40.712776,
            "longitude": -74.005974,
            "category": "E-waste",
            "color": "yellow",
            "address": "101 Silicon St, Lower Manhattan, NY 10007",
            "hours": "Mon-Fri: 9:00 AM - 7:00 PM, Sun: 11:00 AM - 5:00 PM",
            "acceptedWaste": ["Laptops & PCs", "Old Smartphones", "Chargers & Cables", "Monitors"],
            "phone": "+1 (555) 369-1470"
        },
        {
            "id": "center_5",
            "name": "Eastside Community Recycling Depot",
            "latitude": 40.729013,
            "longitude": -73.978210,
            "category": "Recycling",
            "color": "blue",
            "address": "14 Depot Rd, East Village, NY 10009",
            "hours": "Mon-Sat: 8:00 AM - 5:00 PM",
            "acceptedWaste": ["Newspaper", "Office Paper", "Steel Cans", "Cardboard"],
            "phone": "+1 (555) 753-9514"
        }
    ]
