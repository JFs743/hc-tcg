import SingleUseCard from './_single-use-card'
import {applySingleUse, flipCoin} from '../../../utils'

class LootingSingleUseCard extends SingleUseCard {
	constructor() {
		super({
			id: 'looting',
			name: 'Looting',
			rarity: 'rare',
			description:
				"Flip a coin.\n\nIf heads, user picks 1 item card from opposing active Hermit and adds it to user's hand.\n\nDiscard after use.",
		})
	}

	register(game) {
		game.hooks.applyEffect.tap(this.id, (action, derivedState) => {
			const {
				singleUseInfo,
				pickedCardsInfo,
				currentPlayer,
				opponentActiveRow,
				step,
			} = derivedState

			if (singleUseInfo?.id === this.id) {
				if (step === 0) {
					// If opponent has no active hermit, can't activate
					if (!opponentActiveRow) return 'INVALID'

					// If opponent has no items on ctive ehrmit, can't activate
					const anyItemCards = opponentActiveRow.itemCards.some(Boolean)
					if (!anyItemCards) return 'INVALID'

					const coinFlip = flipCoin(currentPlayer)
					currentPlayer.coinFlips[this.id] = coinFlip
					return coinFlip === 'heads' ? 'NEXT' : 'DONE'
				} else if (step === 1) {
					currentPlayer.coinFlips[this.id] = null
					if (pickedCardsInfo.length !== 1) return 'INVALID'
					const pickedCard = pickedCardsInfo[0]
					if (pickedCard.cardInfo.type !== 'item') return 'INVALID'
					pickedCard.row.itemCards[pickedCard.slotIndex] = null
					currentPlayer.hand.push(pickedCard.card)
					return 'DONE'
				}
			}
		})
	}
}

export default LootingSingleUseCard
