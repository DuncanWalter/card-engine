import type { Reward as RewardT } from ".rewardLibrary"
import { Modal, Block, Col, Button } from "../utility";
import { withState, stream } from "../state"
import { navigateTo } from "../utils/navigation";
import { overStream } from "../components/withAnimation";

type Props = { state: *, match: any }

export const Rewards = withState(({ state, match }) => {
    return <div>
        <Modal>
            <h1>Combat Rewards</h1>
            <Col>{
                state.path.rewards.filter(reward => 
                    !reward.collected
                ).map(reward => 
                    <Reward reward={ reward }/>
                )
            }</Col>
            <Button onClick={ () => navigateTo(`/game/pathSelection`) }>Continue</Button>
        </Modal>
    </div>
})

const Reward: Component<{ reward: RewardT, state: * }> = withState(({ reward, state }) => {
    return <Block>
        <Button 
            style={{ width: '430px', height: '60px' }}
            onClick={e => reward.collect(reward, state)}
        >
            <p>{ reward.description }</p>
        </Button>
    </Block>
})