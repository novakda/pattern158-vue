export interface CompanyFitCriterion {
  thesis: string
  body: string
}

export const companyFit = {
  heading: 'Where I Fit Best',
  criteria: [
    {
      thesis: 'Product company over consultancy.',
      body: 'I spent 28.5 years at a consultancy. I know the model. I\u2019m looking for a company that ships a product and stands behind it \u2014 where engineering quality is a business advantage, not a line item someone\u2019s trying to minimize.',
    },
    {
      thesis: 'Mid-size \u2014 roughly 100 to 1,000 people.',
      body: 'Big enough for interesting integration problems and competitive compensation. Small enough that a senior IC with my breadth has visible impact and isn\u2019t anonymized into a team of 200.',
    },
    {
      thesis: 'Late-stage startup to established mid-market.',
      body: 'Startup energy with healthy processes. Not a 10-person seed stage burning runway, not a Fortune 100 where changing a button color requires three committees.',
    },
    {
      thesis: 'Domain complexity is a plus.',
      body: 'I\u2019ve shipped production software for banking (HSBC, PNC, TD Bank, Wells Fargo), defense (General Dynamics Electric Boat), energy (CSBB across 10+ utilities), and healthcare. Regulated industries with real constraints are where my forensic methodology pays off \u2014 not a liability.',
    },
  ] satisfies CompanyFitCriterion[],
}
