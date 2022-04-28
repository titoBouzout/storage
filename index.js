let store

function test() {
	let t = '_t'
	store.setItem(t, t)
	store.getItem(t)
	store.removeItem(t)
}

try {
	store = localStorage
	test()
} catch (e) {
	try {
		store = sessionStorage
		test()
	} catch (e) {
		store = {
			setItem: function (k, v) {
				return (this[k] = v)
			},
			getItem: function (k) {
				return this[k]
			},
			removeItem: function (k) {
				delete this[k]
			},
		}
	}
}

let storage = new Proxy(
	{
		on(obj, key) {
			key = key !== undefined ? key + '.' : ''

			let defaultValues = JSON.parse(JSON.stringify(obj))
			for (var id in obj) {
				let value = storage[key + id]
				if (value !== null) {
					obj[id] = value
				}
			}
			return new Proxy(obj, {
				get(target, prop, receiver) {
					if (prop === 'reset') {
						return function () {
							for (var id in defaultValues) {
								delete storage[key + id]
								target[id] = defaultValues[id]
							}
						}
					}
					return Reflect.get(target, prop, receiver)
				},
				set(target, prop, value) {
					storage[key + prop] = value
					return Reflect.set(target, prop, value)
				},
			})
		},
	},
	{
		get(target, prop, receiver) {
			if (prop in target) {
				return target[prop]
			}
			let value = store.getItem(prop)
			if (value !== null) {
				try {
					value = JSON.parse(value)
				} catch (e) {}
			}
			return value
		},
		set(target, prop, value) {
			store.setItem(prop, JSON.stringify(value))
			return true
		},
		deleteProperty: function (target, prop) {
			store.removeItem(prop)
			return true
		},
		has: function (target, key) {
			return key in store
		},
		ownKeys: function (target, key) {
			return Object.keys(store)
		},
		getOwnPropertyDescriptor: function (target, key) {
			var value = this.get(target, key)
			return value !== null
				? {
						value: value,
						writable: true,
						enumerable: true,
						configurable: true,
				  }
				: null
		},
	},
)

export default storage
