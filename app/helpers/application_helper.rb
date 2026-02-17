module ApplicationHelper
end

# Tailwind-styled pagination for Pagy
module ApplicationHelper
	def pagy_tailwind_nav(pagy)
		return "" unless pagy && pagy.pages && pagy.pages > 1
		link = pagy_link_proc(pagy)
		html = +""
		html << "<nav class='flex items-center justify-center gap-2 my-3' aria-label='Pagination'>"

		if pagy.prev
			html << link.call(pagy.prev, '&lt;', "px-3 py-1 rounded border bg-white text-gray-700")
		else
			html << "<span class='px-3 py-1 rounded border bg-gray-100 text-gray-400' aria-disabled='true'>&lt;</span>"
		end

		pagy.series.each do |item|
			if item == :gap
				html << "<span class='px-2 text-gray-500'>…</span>"
			elsif item.is_a?(Integer)
				if item == pagy.page
					html << "<span class='px-3 py-1 rounded bg-teal-700 text-white'>#{item}</span>"
				else
					html << link.call(item, item.to_s, "px-3 py-1 rounded border text-sm hover:bg-white/5")
				end
			end
		end

		if pagy.next
			html << link.call(pagy.next, '&gt;', "px-3 py-1 rounded border bg-white text-gray-700")
		else
			html << "<span class='px-3 py-1 rounded border bg-gray-100 text-gray-400' aria-disabled='true'>&gt;</span>"
		end

		html << "</nav>"
		html.html_safe
	end
end
