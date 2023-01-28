import SingleUseCard from './_single-use-card'
import {discardCard} from '../../../utils'

class FlintAndSteelSingleUseCard extends SingleUseCard {
	constructor() {
		super({
			id: 'flint_&_steel',
			name: 'Flint & Steel',
			rarity: 'common',
			description: 'Discard your hand. Draw 3 cards.\n\nDiscard after use.',
		})
	}
	register(game) {
		game.hooks.applyEffect.tap(this.id, (action, derivedState) => {
			const {singleUseInfo, currentPlayer} = derivedState

			if (singleUseInfo?.id === this.id) {
				currentPlayer.hand.forEach((card) => discardCard(game.state, card))
				for (let i = 0; i < 3; i++) {
					const drawCard = currentPlayer.pile.shift()
					if (drawCard) currentPlayer.hand.push(drawCard)
				}
				return 'DONE'
			}
		})
	}
}

export default FlintAndSteelSingleUseCard
