import gql from 'graphql-tag';

export const orderAddressFragment = gql`
  fragment orderAddress on OrderAddress {
    city
    company
    country_code
    fax
    firstname
    middlename
    lastname
    postcode
    prefix
    region
    region_id
    street
    suffix
    telephone
  }
`;
