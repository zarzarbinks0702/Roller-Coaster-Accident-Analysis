const data = [
    {
      label: 'water slide 23%',
      cases: 3530,
    },
    {
      label: 'coaster 18%',
      cases: 2748,
    },
    {
      label: 'spinning 13%',
      cases: 1988,
    },
    {
      label: 'go-kart 12%',
      cases: 1767,
    },
    {
      label: 'other attraction 10%',
      cases: 1477,
      },
    {
      label: 'water ride 8%',
      cases: 1163,
    },
    {
      label: 'cars & track rides 7%',
      cases: 1025,
    },
    {
      label: 'aquatic play 4%',
      cases: 465,
    },
    {
      label: 'play equipment 3%',
      cases: 403,
    },
    {
      label: 'pendulum 2%',
      cases: 318,
    },
  ];
  
  const colors = [ '#caf1ff', '#a2e6ff', '#7bdbff', '#54d1ff', '#2dc6ff', '#05bcff', '#22bdf6', '#34b5e4', '#45add3', '#57a4c1']
  
  const width = 771,
    chartWidth = 389,
    chartHeight = 389,
    height = 578,
    radius = Math.min(chartWidth, chartHeight) / 2,
    innerRadius = radius - radius + 50;
  
  
  
  const svg = d3.select('#donut-chart')
    .attr('width', width)
    .attr('height', height);
  
  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius);
  
  const pie = d3.pie().value(d => d.cases)
  
  const arcGroup = svg
    .append('g')
    .attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`)
    .attr('class', 'arc-group');
  
  arcGroup
    .selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc-group')
    .append('path')
    .attr('class', 'arc')
    .attr('d', arc)
    .attr('fill', (d, i) => colors[i])
    .on('mousemove', () => {
      const {clientX, clientY} = d3.event
      d3.select('.tooltip')
        .attr('transform', `translate(${clientX} ${clientY})`)
    })
    .on('mouseenter', d => {
      d3.select('.tooltip').append('text')
        .text(`${d.data.label} = ${d.data.cases} accidents`)
    })
    .on('mouseleave', () => d3.select('.tooltip text').remove())
  
  const tooltipGroup = svg
    .append('g')
    .attr('class', 'tooltip')
    