from .mutation_type import mutation
from .create_patient import mutation
from .create_pathway import mutation
from .create_decision_point import mutation
from .lock_on_pathway import mutation
from .update_pathway import mutation
from .delete_pathway import mutation
from .submit_feedback import mutation
from .create_mdt import mutation
from .update_mdt import mutation
from .delete_mdt import mutation
from .update_on_mdt import mutation
from .delete_on_mdt import mutation
from .lock_on_mdt import mutation
from .update_on_mdt_list import mutation

type_list = [mutation]
