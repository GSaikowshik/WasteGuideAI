function Stats() {

    const stats = [

        {
            number:"1200+",
            label:"Items Scanned"
        },

        {
            number:"92%",
            label:"Recycle Rate"
        },

        {
            number:"45",
            label:"Collection Centers"
        },

        {
            number:"500+",
            label:"Users"
        }

    ];

    return(

        <section className="bg-green-700 text-white py-16">

            <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">

                {stats.map((item,index)=>(

                    <div key={index}>

                        <h2 className="text-5xl font-bold">

                            {item.number}

                        </h2>

                        <p className="mt-3">

                            {item.label}

                        </p>

                    </div>

                ))}

            </div>

        </section>

    )

}

export default Stats;