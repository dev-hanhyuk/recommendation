import React from 'react'
import { connect } from 'react-redux'
import { fetchItemsFromServer } from '_actions/item'
import { like, dislike } from '_actions/preference'
import { recommendForUser } from '_actions/recommendation'

class Items extends React.Component {
    constructor(props) {
      super(props)
    }

    componentWillMount () {
      this.props.fetchItemsFromServer();
    }

    like = (user, item) => {
      this.props.like(user, item);
      // this.props.recommendForUser(user);
    }

    dislike = (user, item) => {
      this.props.dislike(user, item);
      // this.props.recommendForUser(user);
    }

    render () {
      const { items } = this.props.item;
      const { user, recommendations }  = this.props;

      return (
        <section style={styles.container}>

          <div>
            <h1>Recommendations For You</h1>
            { recommendations.map(r => (
              <div key={r.id} style={styles.imageContainer}>
                <div><img src={r.thumbnail} style={styles.thumbnail}/></div>
                <div>{r.id} - {r.name}</div>
              </div>
            ))}
          </div>

          <div style={styles.space}><h1>ITEM LIST</h1></div>
          {
            items.map(i =>
              <div key={i.id} style={styles.imageContainer}>
                <div><img src={i.thumbnail} style={styles.thumbnail}/></div>
                <div>{i.id} - {i.name}</div>
                <div><button onClick={() => this.like(user.id, i.id)}>Like</button><button onClick={() => this.dislike(user.id, i.id)}>Dislike</button></div>
              </div>
            )
          }
        </section>
      )
    }
}

const styles={
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '300px',
    height: '400px',
    margin: 60,
    float: 'left'
  },
  thumbnail: {
    width: '300px',
    height: '400px',
  },
  space: {
    marginTop: 100,
    display: 'block'
  },
}

const mapStateToProps = ({ item, user, recommendations }) => ({ item, user, recommendations });
export default connect(mapStateToProps, { fetchItemsFromServer, like, dislike, recommendForUser }) (Items);
