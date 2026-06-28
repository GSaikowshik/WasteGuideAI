function WasteResult({ result }) {

    return (

        <div className="bg-white rounded-2xl shadow-xl p-8 mt-10">

            <h2 className="text-2xl font-bold text-green-700">
                AI Analysis
            </h2>

            <div className="space-y-3 mt-6">

                <p><strong>Item:</strong> {result.item}</p>

                <p><strong>Category:</strong> {result.category}</p>

                <p><strong>Recyclable:</strong> {result.recyclable ? "Yes" : "No"}</p>

                <p><strong>Hazard:</strong> {result.hazard}</p>

                <p><strong>Eco Suggestion:</strong></p>

                <p>{result.ecoSuggestion}</p>

                <h3 className="font-bold mt-6">
                    Disposal Steps
                </h3>

                <ul className="list-disc ml-6">

                    {result.disposalSteps?.map((step, index) => (

                        <li key={index}>{step}</li>

                    ))}

                </ul>

                <h3 className="font-bold mt-6">
                    Recycling Instructions
                </h3>

                <ul className="list-disc ml-6">

                    {result.recyclingInstructions?.map((step, index) => (

                        <li key={index}>{step}</li>

                    ))}

                </ul>

            </div>

        </div>

    );

}

export default WasteResult;