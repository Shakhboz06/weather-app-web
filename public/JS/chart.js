let rainChart
export const barGraph = (data) => {
    let precipitationData
    const date = data.map(el => new Date(el.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }))
    const pop = data.map(el => Math.round(el.pop * 100))

    
    precipitationData = {
        labels: date,
        datasets: [{
            label: 'Chance of Rain (%)',
            data: pop,
            backgroundColor: 'rgba(173, 216, 230, 0.5)',
            borderColor: 'rgba(173, 216, 230, 1)',
            borderWidth: 1,
            borderSkipped: false,
            // categoryPercentage: 0.5,
            barPercentage: 1,
            borderRadius: 10,
        }]
    }
    const config = {
        type: 'bar',
        data: precipitationData,
        options: {
            // responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#fff',
                        font: {
                            family: 'Roboto',
                        }

                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: '#fff',
                        beginAtZero: true,
                        font: {
                            family: 'Roboto'
                        },
                        callback: (value) => value + "%"
                    },
                    min: 0,
                    max: 100,
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        font: {
                            family: 'Roboto'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `Chance of Rain: ${context.parsed.y}%`
                    },
                    titleFont: {
                        family: 'Roboto',
                    },
                    bodyFont: {
                        family: 'Roboto',
                    }
                }
            }
        }
    }

    const ctx = document.getElementById('rainChart').getContext('2d')
    if (rainChart) rainChart.destroy()
    rainChart = new Chart(ctx, config)

    return rainChart
}

