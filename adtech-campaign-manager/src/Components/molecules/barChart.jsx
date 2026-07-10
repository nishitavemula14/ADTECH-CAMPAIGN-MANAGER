export default function BarChart({ data }) {
  const maxBudget = Math.max(
    ...data.map((campaign) => Number(campaign.budget)),
    1
  );

  const yAxisValues = [
    maxBudget,
    Math.round(maxBudget * 0.75),
    Math.round(maxBudget * 0.5),
    Math.round(maxBudget * 0.25),
    0,
  ];


  return (
    <div className="w-full">
      <div className="flex">
        <div className="h-80 flex flex-col justify-between text-xs text-gray-500 pr-4">
          {yAxisValues.map((value) => (
            <span key={value}>
              ₹{value.toLocaleString()}
            </span>
          ))}
        </div>

        <div className="flex-1">
          <div
            className="
              h-80
              border-l
              border-b
              border-gray-300
              flex
              items-end
              justify-center
              gap-10
              px-6
            "
          >


            {data.map((campaign) => {

              const budget = Number(campaign.budget);


              const height =
                (budget / maxBudget) * 100;



              return (

                <div
                  key={campaign.id}
                  className="
                    h-full
                    flex
                    items-end
                    justify-center
                    w-20
                  "
                >

                  <div
                    className="
                      w-12
                      bg-blue-600
                      rounded-t-md
                      hover:bg-blue-700
                      transition-all
                    "
                    style={{
                      height: `${height}%`
                    }}
                  />

                </div>

              );

            })}
          </div>
          <div
            className="flex justify-center gap-10 px-6 mt-3">

            {data.map((campaign)=>(
              <div
                key={campaign.id}
                className="w-20 text-xs text-center break-words
                "
              >
                {campaign.name}
              </div>
            ))}


          </div>
        </div>
      </div>
      <div className="text-center mt-4 text-sm font-semibold text-gray-600">
        Campaigns
      </div>
    </div>
  );
}