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

import writeEffect from '@titodp/write-effect'

let storage = new Proxy(
	{
		on(obj, key) {
			key = key !== undefined ? key : ''

			let defaultValues = JSON.parse(JSON.stringify(obj))
			let savedValues = JSON.parse(storage[key]) || {}
			for (let id in obj) {
				let value = savedValues[id]
				if (value !== null && value !== undefined) {
					obj[id] = value
				}
			}
			let timeout = false
			let proxied = writeEffect(obj, () => {
				clearTimeout(timeout)
				timeout = setTimeout(() => {
					storage[key] = JSON.stringify(obj)
				}, 100)
			})
			proxied.reset = function () {
				for (let id in defaultValues) {
					proxied[id] = defaultValues[id]
				}
			}
			return proxied
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
