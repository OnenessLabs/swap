import validateAndParseAddress from './validateAndParseAddress'

describe('#validateAndParseAddress', () => {
  it('returns same address if already checksummed', () => {
    expect(validateAndParseAddress('0xCD1aE8750814b3D5EC8daFD73a91420A47c7e845')).toEqual(
      '0xCD1aE8750814b3D5EC8daFD73a91420A47c7e845'
    )
  })

  it('returns checksummed address if not checksummed', () => {
    expect(validateAndParseAddress('0xCD1aE8750814b3D5EC8daFD73a91420A47c7e845'.toLowerCase())).toEqual(
      '0xCD1aE8750814b3D5EC8daFD73a91420A47c7e845'
    )
  })

  it('throws if not valid', () => {
    expect(() => validateAndParseAddress('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6')).toThrow(
      '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6 is not a valid address.'
    )
  })
})
