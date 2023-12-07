/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectIntl } from 'react-intl'

const MyCertificatesLink = ({ render, intl }: any) => {
  return render([
    {
      name: intl.formatMessage({ id: 'myCertificates.link' }),
      path: '/certificates',
    },
  ])
}

export default injectIntl(MyCertificatesLink)
